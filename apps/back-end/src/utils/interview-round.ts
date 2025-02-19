import { InterviewRoundStatus } from "@agent-xenon/constants";
import filterCandidateAgent from "../agents/screening-candidate";
import { IInterviewRounds, IJob } from "@agent-xenon/interfaces";
import { getApplicantDetails } from "./applicant";
import { createEncodedShortToken } from "./generate-token";
import { config } from "../config";
import { sendMail } from "../helper/mail";
import InterviewRounds from "../database/models/interview-round";
import { RootFilterQuery } from "mongoose";
import Organization from "../database/models/organization";
import { oauth2Client } from "../helper/third-party-oauth";
import { Response } from "express";
import { google } from "googleapis";
import { generatePossibleTimeSlots, getDaysInCurrentMonth } from "./manage-dates";
import Job from "../database/models/job";

export const manageScreeningRound = async (roundData: IInterviewRounds<IJob>, isFirstRound: boolean) => {
    const Query: RootFilterQuery<IInterviewRounds> = { _id: roundData._id };
    try {
        const jobId = roundData.jobId._id.toString();
        await filterCandidateAgent(roundData.qualificationCriteria, jobId, isFirstRound ? roundData._id.toString() : roundData._doc.previousRound._id, isFirstRound);
        await InterviewRounds.updateOne(Query, { $set: { status: InterviewRoundStatus.COMPLETED } });
    } catch (error) {
        console.log("manageScreeningRound: error: ", error);
        await InterviewRounds.updateOne(Query, { $set: { status: InterviewRoundStatus.YET_TO_START } });
    }
}

export const manageTechnicalRound = async (roundData: IInterviewRounds<IJob>, isFirstRound: boolean) => {
    const applicants = await getApplicantDetails(roundData.jobId._id, isFirstRound ? roundData._id.toString() : roundData._doc.previousRound._id, isFirstRound);
    await Promise.all(applicants.map((i) => {
        const token = createEncodedShortToken(roundData._id.toString(), i._id.toString(), i.organizationId.name)
        return sendMail(i.contactInfo.email, `Technical Round Exam Link`, `
            Dear candidate,

            We have receive your inquiry in our organization as your are looking to collaborate in our team.

            ${roundData?.previousRound?.type ? `You are selected in ${roundData.previousRound.type} round. And now ready for ${roundData.type} round.` : `Get ready for your first ${roundData.type} round.`}

            We are sending you a link to give examnication from your home.

            Your credentials:
            Email: ${i.contactInfo.email}
            Password: ${i.contactInfo.password}

            Please login with above credentials and start examination.

            Here is your examincation link: ${config.FRONTEND_URL.replace(/\/\/([^.]*)/, `//${i.organizationId.name.replace(/\s+/g, "")}`)}?token=${token}

            Best wishes and good luck.
            Thank you.
            HR ${i.organizationId.name}.
        `)
    }));
    const currentDate = Date.now();
    await InterviewRounds.updateOne({ _id: roundData._id }, { $set: { startDate: currentDate, endDate: currentDate + (roundData.durationInSeconds * 1000) } });
}

export const manageMeetingRound = async (roundData: IInterviewRounds<IJob>, isFirstRound: boolean, organizationId?: string, res?: Response) => {
    const checkTokenExist = await Organization.findOne({ _id: organizationId, deletedAt: null, "serviceProviders.google.expiry": { $gt: new Date() } });
    const jobId = roundData.jobId._id.toString();
    const roundId = isFirstRound ? roundData._id.toString() : roundData._doc.previousRound._id;
    if (!checkTokenExist) {
        const redirectUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            // prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/userinfo.email",
            ],
            state: `${organizationId.toString()}_${jobId}_${roundId}_${isFirstRound}`,
        })
        return res.ok("success", { redirectUrl }, "customMessage");
    }
    const { accessToken, expiry, refreshToken, scope, email } = checkTokenExist.serviceProviders.google;
    oauth2Client.setCredentials({ access_token: accessToken, expiry_date: expiry.getTime(), refresh_token: refreshToken, scope })

    const eventDetails = await manageMeetingScheduleWithCandidate(jobId, roundId, isFirstRound, email);

    await InterviewRounds.updateOne({ _id: roundData._id }, { $set: { status: InterviewRoundStatus.COMPLETED } });

    return res.ok("interview round started successfully", { eventDetails }, "customMessage");
}

export const getCalenderEvents = async (startDateTime: string, endDateTime: string) => {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDateTime,
        timeMax: endDateTime,
        // maxResults: 10,
        singleEvents: true,
        // orderBy: 'startTime',
    });

    return events;
}

export const createEventInCalender = async (title: string, interviewerEmail: string, candidateEmail: string, startDateTime: string, endDateTime: string) => {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
        description: `Interview Schedule For ${title}`,
        start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
        end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Kolkata',
        },
        summary: `Your interview for ${title} is scheduled on following date. please join before the 5 minutes on given date & time.`,
        location: 'Online',
        attendees: [{ email: interviewerEmail }, { email: candidateEmail }],
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
            ],
        },
        sendUpdates: "all",
        conferenceData: {
            createRequest: {
                requestId: "ABC_" + Date.now(),
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    }

    const eventData = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        conferenceDataVersion: 1
    });

    return eventData;
}

export const manageMeetingScheduleWithCandidate = async (jobId: string, roundId: string, isFirstRound: boolean, interviewerEmail: string) => {
    const daysInCurrentMonth = getDaysInCurrentMonth();

    let startDateTime = new Date();
    const endDateTime = new Date(new Date().setHours(23 * daysInCurrentMonth, 59 * daysInCurrentMonth, 59 * daysInCurrentMonth, 999 * daysInCurrentMonth)).toISOString();

    const { data } = await getCalenderEvents(startDateTime.toISOString(), endDateTime);
    const { items } = data;

    const applicants = await getApplicantDetails(jobId, roundId, isFirstRound);

    const scheduledMeetings = [];
    for (const applicant of applicants) {
        startDateTime = generatePossibleTimeSlots(startDateTime.toISOString(), endDateTime, items);
        if (startDateTime) {
            const jobData = await Job.findOne<Pick<IJob, "title">>({ _id: jobId, deletedAt: null }, "title");
            const start = startDateTime.toISOString();
            startDateTime.setMinutes(startDateTime.getMinutes() + 60);
            const end = startDateTime.toISOString();
            const eventData = await createEventInCalender(jobData.title, interviewerEmail, applicant.contactInfo.email, start, end);
            scheduledMeetings.push(eventData.data);
        } else {
            console.error(`No available slots for ${applicant.contactInfo.email}`);
            break;
        }
    }

    return scheduledMeetings;
}
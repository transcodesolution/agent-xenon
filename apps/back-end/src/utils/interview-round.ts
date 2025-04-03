import { App, InterviewRoundStatus } from "@agent-xenon/constants";
import filterCandidateAgent from "../agents/screening-candidate";
import { IInterviewRound, IJob } from "@agent-xenon/interfaces";
import { getSelectedApplicantDetails } from "./applicant";
import { config } from "../config";
import { sendMail } from "../helper/mail";
import InterviewRound from "../database/models/interview-round";
import { QuerySelector, RootFilterQuery } from "mongoose";
import Organization from "../database/models/organization";
import { oauth2Client } from "../helper/third-party-oauth";
import { Response } from "express";
import { calendar_v3, google } from "googleapis";
import { generatePossibleTimeSlots, getDaysInCurrentMonth } from "./manage-dates";
import Job from "../database/models/job";
import ApplicantRound from "../database/models/applicant-round";
import { socketIo } from "../helper/socket";
import { checkGoogleTokenExpiry } from "./google-service";
import AppModel from "../database/models/app";

export const manageScreeningRound = async (roundData: IInterviewRound<IJob>, organizationId: string) => {
    const Query: RootFilterQuery<IInterviewRound> = { _id: roundData._id };
    try {
        const jobId = roundData.jobId._id.toString();
        await filterCandidateAgent(roundData.qualificationCriteria, jobId, roundData._id.toString());
        await InterviewRound.updateOne(Query, { $set: { status: InterviewRoundStatus.COMPLETED } });
        socketIo.to(organizationId).emit("round-status", { status: InterviewRoundStatus.COMPLETED, message: "Screening round is completed! You can check the status!" });
    } catch (error) {
        console.log("manageScreeningRound: error: ", error);
        await InterviewRound.updateOne(Query, { $set: { status: InterviewRoundStatus.YET_TO_START } });
    }
}

export const manageTechnicalRound = async (roundData: IInterviewRound<IJob>) => {
    const applicants = await getSelectedApplicantDetails(roundData.jobId._id);
    const domainUrl = config.FRONTEND_URL.replace(/(?<=\/\/)([^.]+)(?=\.)/, `${applicants[0]?.organizationId?.name.replace(/\s+/g, "")}`);
    const roundId = roundData._id.toString();

    const bulkOps = applicants.map(i => ({
        updateOne: {
            filter: { jobId: roundData.jobId._id, applicantId: i._id },
            update: { $set: { jobId: roundData.jobId._id, applicantId: i._id, status: InterviewRoundStatus.ONGOING }, $push: { roundIds: roundId } },
            upsert: true
        }
    }));

    await ApplicantRound.bulkWrite(bulkOps);

    await Promise.all(applicants.map((i) => {
        return sendMail(i.contactInfo.email, `Technical Round Exam Link`, `
            Dear candidate,

            We have receive your inquiry in our organization as your are looking to collaborate in our team.

            Get ready for your first ${roundData.type} round.

            We are sending you a link to give examnication from your home.

            Your credentials:
            Email: ${i.contactInfo.email}
            Password: ${i.password}

            Please login with above credentials and start examination.

            Here is your examincation link: ${domainUrl}/${roundId}

            Best wishes and good luck.
            Thank you.
            HR ${i.organizationId.name}.
        `)
    }));
}

export const manageMeetingRound = async (roundData: IInterviewRound<IJob>, organizationId?: string, res?: Response) => {
    const [organizationData, appData] = await Promise.all([
        Organization.findOne({ _id: organizationId, deletedAt: null }, { "serviceProviders": 1 }),
        getAppDataByType(App.GOOGLE)
    ]);

    const jobId = roundData.jobId._id.toString();
    const roundId = roundData._id.toString();

    const expiryResponse = await checkGoogleTokenExpiry(organizationData.serviceProviders, appData._id.toString(), organizationId);

    if (!expiryResponse.isExpired) {
        return res.expectationFailed(expiryResponse.message, {}, "customMessage");
    }

    res.ok("meeting round is started successfully", {}, "customMessage");
    await manageMeetingScheduleWithCandidate(jobId, roundData.interviewerEmail, roundId);
}

export const generateGoogleAuthUrl = (organizationId: string) => {
    const redirectUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
        state: organizationId,
    });
    return redirectUrl;
}

export const getAppDataByType = async (App: App) => {
    const appData = await AppModel.findOne({ name: App });
    return appData;
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

    const attendees = [];

    if (interviewerEmail) {
        attendees.push({ email: interviewerEmail });
    }

    if (candidateEmail) {
        attendees.push({ email: candidateEmail });
    }

    const event: calendar_v3.Schema$Event = {
        description: `Interview Schedule For ${title}`,
        start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
        end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Kolkata',
        },
        summary: `Your interview for ${title} is scheduled on following date. please join before the 5 minutes on given date & time.`,
        location: 'Online',
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
            ],
        },
        conferenceData: {
            createRequest: {
                requestId: "ABC_" + Date.now(),
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    }

    event.attendees = attendees;

    const eventData = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
    });

    return eventData;
}

export const manageMeetingScheduleWithCandidate = async (jobId: string, interviewerEmail: string, roundId: string) => {
    try {
        const daysInCurrentMonth = getDaysInCurrentMonth();

        let startDateTime = new Date();
        const endDateTime = new Date(new Date().setHours(23 * daysInCurrentMonth, 59 * daysInCurrentMonth, 59 * daysInCurrentMonth, 999 * daysInCurrentMonth)).toISOString();

        const { data } = await getCalenderEvents(startDateTime.toISOString(), endDateTime);
        const { items } = data;

        const applicants = await getSelectedApplicantDetails(jobId);

        // const scheduledMeetings = [];
        for (const applicant of applicants) {
            const applicantId = applicant._id.toString();
            startDateTime = generatePossibleTimeSlots(startDateTime.toISOString(), endDateTime, items);
            if (startDateTime) {
                const jobData = await Job.findOne<Pick<IJob, "title">>({ _id: jobId, deletedAt: null }, "title");
                const start = startDateTime.toISOString();
                startDateTime.setMinutes(startDateTime.getMinutes() + 60);
                const end = startDateTime.toISOString();
                const eventData = await createEventInCalender(jobData.title, interviewerEmail, applicant.contactInfo.email, start, end);
                // scheduledMeetings.push(eventData.data);
                await ApplicantRound.updateOne({ jobId, applicantId }, { $set: { jobId, applicantId, status: InterviewRoundStatus.ONGOING, }, $push: { roundIds: roundId } }, { upsert: true })
            } else {
                console.error(`No available slots for ${applicant.contactInfo.email}`);
                break;
            }
        }

        // await InterviewRound.updateOne({ _id: roundId }, { $set: { status: InterviewRoundStatus.COMPLETED } });

        // return scheduledMeetings;
    } catch (error) {
        console.error("manageMeetingScheduleWithCandidate: ", error);
        console.error("dateTime: ", new Date());
    }
}

export const updateApplicantStatusOnRoundComplete = async <T>(interviewRoundIdQuery: QuerySelector<T>) => {
    return ApplicantRound.updateMany({ roundIds: { $elemMatch: interviewRoundIdQuery }, status: InterviewRoundStatus.ONGOING }, { $set: { status: InterviewRoundStatus.COMPLETED, isSelected: false, }, });
}
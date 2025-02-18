import { InterviewRoundStatus } from "@agent-xenon/constants";
import filterCandidateAgent from "../agents/screening-candidate";
import { IInterviewRounds, IJob } from "@agent-xenon/interfaces";
import { getApplicantDetails } from "./applicant";
import { createEncodedShortToken } from "./generate-token";
import { config } from "../config";
import { sendMail } from "../helper/mail";
import InterviewRounds from "../database/models/interview-round";
import { RootFilterQuery } from "mongoose";

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

export const manageMeetingRound = async (roundData: IInterviewRounds<IJob>) => {
    // will handle meeting round logic
}
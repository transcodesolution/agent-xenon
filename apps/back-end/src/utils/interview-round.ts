import { InterviewRoundStatus } from "@agent-xenon/constants";
import filterCandidateAgent from "../agents/screening-candidate";
import ApplicantRounds from "../database/models/applicant-round";
import { IInterviewRounds, IJob } from "@agent-xenon/interfaces";

export const manageScreeningRound = async (roundData: IInterviewRounds<IJob>) => {
    const jobId = roundData.jobId._id.toString();
    const data = await filterCandidateAgent(roundData.qualificationCriteria, jobId, roundData._id.toString());

    await ApplicantRounds.insertMany((data?.message?.map((i) => ({
        applicantId: i,
        roundId: roundData._id,
        jobId,
        status: InterviewRoundStatus.COMPLETED,
        isSelected: true,
    })) ?? []));
}

export const manageTechnicalRound = async (roundData: IInterviewRounds<IJob>) => {
    // will handle technical round logic
}

export const manageMeetingRound = async (roundData: IInterviewRounds<IJob>) => {
    // will handle meeting round logic
}
import { IApplicant, IOrganization } from "@agent-xenon/interfaces";
import Applicant from "../database/models/applicant";
import ApplicantRound from "../database/models/applicant-round";
import { InterviewRoundStatus } from "@agent-xenon/constants";

export async function getSelectedApplicantDetails(jobId: string) {
    const alreadySelectedApplicantIds = await ApplicantRound.distinct("applicantId", { jobId, deletedAt: null, isSelected: false });
    const applicants = await Applicant.find<IApplicant<Pick<IOrganization, "name">>>({ appliedJobIds: { $elemMatch: { $eq: jobId } }, deletedAt: null, _id: { $nin: alreadySelectedApplicantIds } }).populate("organizationId", "name");
    return applicants;
}

export function getApplicantRoundStatusCommonQuery(roundId: string) {
    return {
        $cond: [{ $ne: [{ $arrayElemAt: ["$roundIds", -1] }, roundId] }, InterviewRoundStatus.SELECTED, { $cond: [{ $eq: ["$status", InterviewRoundStatus.ONGOING] }, "$status", { $cond: ["$isSelected", InterviewRoundStatus.SELECTED, InterviewRoundStatus.REJECTED] }] }]
    };
}

export function updateApplicantToDatabase(email: string, applicantDetail: IApplicant, jobId: string) {
    return Applicant.findOneAndUpdate({ "contactInfo.email": email, deletedAt: null }, { $set: applicantDetail, $push: { appliedJobIds: jobId } }, { new: true, upsert: true });
}
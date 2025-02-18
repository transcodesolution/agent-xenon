import { IApplicant, IOrganization } from "@agent-xenon/interfaces";
import Applicant from "../database/models/applicant";
import ApplicantRounds from "../database/models/applicant-round";

export async function getApplicantDetails(jobId: string, roundId: string, isFirstRound: boolean) {
    const alreadySelectedApplicantIds = await ApplicantRounds.distinct("applicantId", { jobId, deletedAt: null, roundId, isSelected: true });
    const applicants = await Applicant.find<IApplicant<Pick<IOrganization, "name">>>({ jobId, deletedAt: null, _id: { [isFirstRound ? '$nin' : '$in']: alreadySelectedApplicantIds } }).populate("organizationId", "name");
    return applicants;
}
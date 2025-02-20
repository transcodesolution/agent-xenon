import { IApplicant, IOrganization } from "@agent-xenon/interfaces";
import Applicant from "../database/models/applicant";
import ApplicantRounds from "../database/models/applicant-round";

export async function getSelectedApplicantDetails(jobId: string) {
    const alreadySelectedApplicantIds = await ApplicantRounds.distinct("applicantId", { jobId, deletedAt: null, isSelected: false });
    const applicants = await Applicant.find<IApplicant<Pick<IOrganization, "name">>>({ jobId, deletedAt: null, _id: { $nin: alreadySelectedApplicantIds } }).populate("organizationId", "name");
    return applicants;
}
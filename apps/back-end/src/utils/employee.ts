import { IApplicant, IJob } from "@agent-xenon/interfaces";
import ApplicantRound from "../database/models/applicant-round"
import Employee from "../database/models/employee";
import InterviewRound from "../database/models/interview-round";
import { RoleType } from "@agent-xenon/constants";
import { Role } from "../database";

export const checkOutApplicantToEmployee = async (applicantId: string, jobId: string) => {
    const totalRounds = await InterviewRound.countDocuments({ jobId, deletedAt: null });
    const applicantIsSelected = await ApplicantRound.findOne({ applicantId, jobId, deletedAt: null, isSelected: true, roundIds: { $size: totalRounds } }).populate<{ applicantId: Pick<IApplicant, "firstName" | "lastName" | "contactInfo" | "password"> }>("applicantId", "firstName lastName contactInfo password").populate<{ jobId: Pick<IJob, "organizationId" | "role" | "designation"> }>("jobId").lean();
    if (applicantIsSelected) {
        const roleData = await Role.findOne({ type: RoleType.EMPLOYEE, deletedAt: null, organizationId: applicantIsSelected.jobId.organizationId });

        await Employee.updateOne({ organizationId: applicantIsSelected.jobId.organizationId, deletedAt: null, "contactInfo.email": applicantIsSelected.applicantId.contactInfo.email }, {
            $set: {
                applicantId, firstName: applicantIsSelected.applicantId.firstName, lastName: applicantIsSelected.applicantId.lastName, organizationId: applicantIsSelected.jobId.organizationId, designationId: applicantIsSelected.jobId.designation, jobRoleId: applicantIsSelected.jobId.role, contactInfo: applicantIsSelected.applicantId.contactInfo, password: applicantIsSelected.applicantId.password, roleId: roleData?._id,
            }
        }, { upsert: true });
    }
}
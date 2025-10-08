import { IApplicant, IEmployee, IJob } from "@agent-xenon/interfaces";
import ApplicantRound from "../database/models/applicant-round"
import Employee from "../database/models/employee";
import InterviewRound from "../database/models/interview-round";
import { RoleType } from "@agent-xenon/constants";
import { Role } from "../database";
import { FilterQuery } from "mongoose";
import { generateMailBody } from "./mail";
import { EMPLOYEE_ADDITION_TEMPLATE } from "../helper/email-templates/employee";
import { sendMail } from "../helper/mail";
import { getRandomNumber } from "./random-number-generator";
import { generateRandomString } from "./random-string-generator";
import { updateFrontendDomainUrl } from "./technical-round";
import { config } from "../config";

export const checkOutApplicantToEmployee = async (applicantId: string, jobId: string, organizationName: string) => {
    const roundQuery: FilterQuery<IJob> = { jobId, deletedAt: null };
    const totalRounds = await InterviewRound.countDocuments(roundQuery);
    const applicantIsSelected = await ApplicantRound.findOne({ applicantId, ...roundQuery, isSelected: true, roundIds: { $size: totalRounds } }).populate<{ applicantId: Pick<IApplicant, "firstName" | "lastName" | "contactInfo" | "password"> }>("applicantId", "firstName lastName contactInfo password").populate<{ jobId: Pick<IJob, "organizationId" | "role" | "designation"> }>("jobId").lean();
    if (applicantIsSelected) {
        const roleData = await Role.findOne({ type: RoleType.EMPLOYEE, deletedAt: null, organizationId: applicantIsSelected.jobId.organizationId });

        const employeePassword = generateEmployeePassword({ firstName: applicantIsSelected.applicantId.firstName, lastName: applicantIsSelected.applicantId.lastName });

        const frontendDomailUrl = updateFrontendDomainUrl(organizationName);

        const html = generateMailBody({ template: EMPLOYEE_ADDITION_TEMPLATE, organizationName, extraData: { employeeEmail: applicantIsSelected.applicantId.contactInfo.email, employeePassword, frontendDomailUrl: `${frontendDomailUrl}${config.EMPLOYEE_PANEL_FRONTEND_ROUTE_NAME}` } });

        await Promise.all([
            Employee.updateOne({ organizationId: applicantIsSelected.jobId.organizationId, deletedAt: null, "contactInfo.email": applicantIsSelected.applicantId.contactInfo.email }, {
                $set: {
                    applicantId, firstName: applicantIsSelected.applicantId.firstName, lastName: applicantIsSelected.applicantId.lastName, organizationId: applicantIsSelected.jobId.organizationId, designationId: applicantIsSelected.jobId.designation, jobRoleId: applicantIsSelected.jobId.role, contactInfo: applicantIsSelected.applicantId.contactInfo, password: employeePassword, roleId: roleData?._id,
                }
            }, { upsert: true }),
            sendMail(applicantIsSelected.applicantId.contactInfo.email, "Employee On Boarded", html),
        ]);
    }
}

export const generateEmployeePassword = ({ firstName, lastName }: Pick<IEmployee, "firstName" | "lastName">) => {
    const randomNumber = getRandomNumber(2000, 4000);
    const randomString = generateRandomString(5);
    return `${firstName}-${lastName}@${randomNumber}-${randomString}`;
}
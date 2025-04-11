import { IDesignation } from "./designation";
import { IJobRole } from "./job-role";
import { IRole } from "./role";
import { ITimestamp } from "./timestamp";

export interface IEmployee extends ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    password: string;
    organizationId: string;
    salary: number;
    jobRole: IJobRole;
    designation: IDesignation;
    jobRoleId: string;
    designationId: string;
    roleId: string;
    role: IRole;
    applicantId: string;
    _doc?: IEmployee;
    contactInfo: {
        address: string;
        city: string;
        email: string;
        phoneNumber: string;
        state: string;
    };
}
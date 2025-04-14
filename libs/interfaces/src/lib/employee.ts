import { IDesignation } from "./designation";
import { IJobRole } from "./job-role";
import { IRole } from "./role";
import { ITimestamp } from "./timestamp";

export interface IAllowance {
    coreCompensation: number;
    houseLivingBenefits: number;
    incentivePerformanceBenefits: number;
    retirementBenefits: number;
    transportationMobilityBenefits: number;
    workRelatedBenefits: number;
}

export interface IDeduction {
    mandatory: number;
    optional: number;
    voluntary: number;
}

export interface ISalary {
    allowances: IAllowance;
    deductions: IDeduction;
    grossSalary: number;
    netSalary: number;
    totalCostToCompany: number;
}

export interface IEmployee extends ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    password: string;
    organizationId: string;
    salaryDetail: ISalary;
    joinDate: Date;
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
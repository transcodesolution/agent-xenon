import { IRole } from "./role";
import { ITimestamp } from "./timestamp";

export interface IProject {
    title: string;
    durationStart: Date;
    durationEnd: Date;
    technologiesUsed: string[];
    description: string;
}

export interface IEducation {
    degree: string;
    institution: string;
    yearOfGraduation: string;
    description: string;
}

export interface IExperienceDetail {
    durationStart: Date;
    durationEnd: Date;
    responsibilities: string;
    role: string;
    organization: string;
}

export interface IApplicant<T = string, U = string> extends ITimestamp {
    _id: string;
    lastName: string;
    contactInfo: {
        address: string;
        city: string;
        state: string;
        email: string;
        password: string;
        phoneNumber: string;
    };
    firstName: string;
    socialLinks: object;
    summary: string;
    skills: string[];
    hobbies: string[];
    strengths: string[];
    salaryExpectation: number;
    feedback: string;
    roleId: U;
    role: IRole;
    jobId: string;
    organizationId: T;
    experienceDetails: IExperienceDetail[];
    education: IEducation[];
    projects: IProject[];
    resumeLink: string;
    isSelectedByAgent: boolean;
    _doc?: IApplicant;
}
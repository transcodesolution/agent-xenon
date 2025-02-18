import { ITimestamp } from "./timestamp";

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
    jobId: string;
    organizationId: T;
    experienceDetails: {
        duration: string;
        responsibilities: string[];
        role: string;
        organization: string;
    }[];
    education: {
        degree: string;
        institution: string;
        yearOfGraduation: string;
        description: string;
    }[];
    projects: {
        description: string;
        duration: string;
        technologiesUsed: string[];
        title: string;
    }[];
    resumeLink: string;
    isSelectedByAgent: boolean;
}
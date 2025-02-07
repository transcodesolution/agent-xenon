import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IApplicant extends Document, ITimestamp {
    _id: string;
    lastName: string | null;
    contactInfo: {
        address: string | null;
        city: string | null;
        state: string;
        email: string;
        phoneNumber: string | null;
    };
    firstName: string | null;
    socialLinks: object;
    summary: string | null;
    skills: string[] | null;
    hobbies: string[] | null;
    strengths: string[] | null;
    salaryExpectation: number | null;
    feedback: string | null;
    jobId: string | null;
    organizationId: string | null;
    experienceDetails: {
        duration: string | null;
        responsibilities: string[] | null;
        role: string | null;
    }[];
    education: {
        degree: string | null;
        institution: string | null;
        yearOfGraduation: string | null;
    }[];
    projects: {
        description: string | null;
        duration: string | null;
        technologiesUsed: string[] | null;
        title: string | null;
    }[];
    resumeLink: string | null;
    isSelectedByAgent: boolean | null;
}
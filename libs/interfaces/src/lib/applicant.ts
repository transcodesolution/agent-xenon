import { IMCQOptions } from "./interview-question";
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
        phoneNumber: string;
    };
    password: string;
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
    appliedJobIds: string[];
    organizationId: T;
    experienceDetails: IExperienceDetail[];
    education: IEducation[];
    projects: IProject[];
    resumeLink: string;
    isSelectedByAgent: boolean;
    _doc?: IApplicant;
}

export interface IApplicantInterviewRounds {
    applicantInterviewRounds: IApplicantInterviewRound[]
}
export interface IApplicantInterviewRound {
    applicantStatus: string;
    endDate: Date;
    name: string;
    selectionMarginInPercentage: number;
    startDate: Date;
    status: string;
    type: string;
    _id: string;
};


export interface IApplicantInterviewRoundDetail {
    interviewRound: IApplicantInterviewRound,
    applicantRoundAndQuestionAnswers: IApplicantQuestionAnswer
}
export interface IApplicantQuestionAnswer {
    _id: string;
    type: string;
    tags: string[];
    organizationId: string;
    questionFormat: string;
    deletedAt: string | null;
    options: IMCQOptions[];
    createdAt: string;
    updatedAt: string;
    description: string;
    difficulty: string;
    evaluationCriteria: string;
    question: string;
    timeLimitInMinutes: number;
    questionId: string;
    answer: string;
    overallResult: string;
    isMultiSelectOption?: boolean;
};

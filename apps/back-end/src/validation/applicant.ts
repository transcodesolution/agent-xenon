import Joi from "joi";
import { paginationSchema } from "./pagination";

const contactInfoSchema = Joi.object({
    address: Joi.string().allow(""),
    city: Joi.string().allow(""),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().allow(""),
    state: Joi.string().allow(""),
});

const socialLinksSchema = Joi.object().pattern(Joi.string(), Joi.string().uri().allow(""));

const experienceDetailsSchema = Joi.array().items(
    Joi.object({
        role: Joi.string().allow(""),
        organization: Joi.string().allow(""),
        duration: Joi.string().allow(""),
        responsibilities: Joi.string().allow(""),
    })
);

const projectsSchema = Joi.array().items(
    Joi.object({
        title: Joi.string().allow(""),
        description: Joi.string().allow(""),
        technologiesUsed: Joi.array().items(Joi.string().allow("")),
        duraction: Joi.string().allow(""),
    })
);

const educationSchema = Joi.array().items(
    Joi.object({
        institution: Joi.string().allow(""),
        degree: Joi.string().allow(""),
        description: Joi.string().allow(""),
        yearOfGraduation: Joi.string().allow(""),
    })
);

export const createApplicantByUserSchema = Joi.object({
    summary: Joi.string().allow(""),
    firstName: Joi.string().allow(""),
    contactInfo: contactInfoSchema.required(),
    lastName: Joi.string().allow(""),
    strengths: Joi.array().items(Joi.string()).allow(""),
    jobId: Joi.string().required(),
    hobbies: Joi.array().items(Joi.string()).allow(""),
    salaryExpectation: Joi.number(),
    socialLinks: socialLinksSchema,
    skills: Joi.array().items(Joi.string()).allow(""),
    feedback: Joi.string().allow(""),
    experienceDetails: experienceDetailsSchema,
    projects: projectsSchema,
    education: educationSchema,
});

export const createApplicantByAgentSchema = Joi.object({
    resumeUrls: Joi.array().items(Joi.string().required()),
    jobId: Joi.string().required(),
});

export const updateApplicantSchema = Joi.object({
    summary: Joi.string().allow(""),
    firstName: Joi.string().allow(""),
    contactInfo: contactInfoSchema.optional(),
    lastName: Joi.string().allow(""),
    strengths: Joi.array().items(Joi.string()).allow(""),
    jobId: Joi.string().required(),
    hobbies: Joi.array().items(Joi.string()).allow(""),
    salaryExpectation: Joi.number(),
    socialLinks: socialLinksSchema,
    skills: Joi.array().items(Joi.string()).allow(""),
    feedback: Joi.string().allow(""),
    experienceDetails: experienceDetailsSchema,
    projects: projectsSchema,
    education: educationSchema,
    applicantId: Joi.string().required(),
});

export const deleteApplicantSchema = Joi.object({
    applicantId: Joi.string().required(),
});

export const getApplicantSchema = Joi.object({
    search: Joi.string().allow("", null).optional(),
    jobId: Joi.string().optional(),
    isSelectedByAgent: Joi.boolean().optional(),
    ...paginationSchema,
});

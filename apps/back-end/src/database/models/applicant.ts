import mongoose, { Schema } from 'mongoose';
import { IApplicant } from '@agent-xenon/interfaces';

const ApplicantSchema: Schema = new Schema({
    lastName: { type: String },
    contactInfo: {
        address: { type: String },
        city: { type: String },
        state: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String },
    },
    firstName: { type: String },
    socialLinks: { type: Object },
    summary: { type: String },
    skills: [{ type: String }],
    hobbies: [{ type: String }],
    strengths: [{ type: String }],
    salaryExpectation: { type: Number },
    feedback: { type: String },
    jobId: { type: Schema.Types.ObjectId, index: true },
    organizationId: { type: Schema.Types.ObjectId, index: true },
    experienceDetails: [{
        duration: { type: String },
        responsibilities: [{ type: String }],
        role: { type: String },
    }],
    education: [{
        degree: { type: String },
        institution: { type: String },
        yearOfGraduation: { type: String },
    }],
    projects: [{
        description: { type: String },
        duration: { type: String },
        technologiesUsed: [{ type: String }],
        title: { type: String },
    }],
    resumeLink: { type: String },
    isSelectedByAgent: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

const Applicant = mongoose.model<IApplicant>('Applicant', ApplicantSchema);

export default Applicant;

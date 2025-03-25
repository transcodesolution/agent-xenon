import mongoose, { Schema } from 'mongoose';
import { IApplicant } from '@agent-xenon/interfaces';

const ApplicantSchema: Schema = new Schema({
    lastName: { type: String },
    contactInfo: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        email: { type: String, required: true },
        password: { type: String },
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
    jobId: { type: Schema.Types.ObjectId, index: true, },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
    experienceDetails: [{
        durationStart: { type: Date },
        durationEnd: { type: Date },
        responsibilities: { type: String },
        role: { type: String },
        organization: { type: String },
        _id: false,
    }],
    education: [{
        degree: { type: String },
        institution: { type: String },
        description: { type: String },
        yearOfGraduation: { type: String },
        _id: false,
    }],
    projects: [{
        description: { type: String },
        durationStart: { type: Date },
        durationEnd: { type: Date },
        technologiesUsed: [{ type: String }],
        title: { type: String },
        _id: false,
    }],
    resumeLink: { type: String },
    roleId: { type: mongoose.SchemaTypes.ObjectId },
    isSelectedByAgent: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true
    },
    virtuals: {
        role: {
            options: {
                ref: 'role',
                localField: 'roleId',
                foreignField: '_id',
                justOne: true
            }
        }
    }
});

const Applicant = mongoose.model<IApplicant>('Applicant', ApplicantSchema);

export default Applicant;

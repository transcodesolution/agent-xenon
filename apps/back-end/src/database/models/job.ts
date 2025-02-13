import mongoose, { Schema } from "mongoose";
import { IJob } from "@agent-xenon/interfaces";
import { JobStatus } from "@agent-xenon/constants";

const JobSchema: Schema = new Schema({
    title: { type: String },
    description: { type: String },
    role: { type: Schema.Types.ObjectId, ref: "role" },
    status: { type: String, enum: JobStatus, default: JobStatus.OPEN },
    designation: { type: Schema.Types.ObjectId },
    qualificationCriteria: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
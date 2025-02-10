import mongoose, { Schema } from "mongoose";
import { JOB_STATUS } from "../../utils/constant";
import { IJob } from "@agent-xenon/interfaces";

const JobSchema: Schema = new Schema({
    title: { type: String },
    description: { type: String },
    role: { type: Schema.Types.ObjectId, ref: "role" },
    status: { type: String, enum: Object.values(JOB_STATUS), default: JOB_STATUS.OPEN },
    designation: { type: Schema.Types.ObjectId },
    qualificationCriteria: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
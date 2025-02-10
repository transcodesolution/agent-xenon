import { IJobRole } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const JobRoleSchema: Schema = new Schema({
  name: { type: String },
  organizationId: { type: Schema.Types.ObjectId },
  deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const JobRole = mongoose.model<IJobRole>('JobRole', JobRoleSchema);

export default JobRole;
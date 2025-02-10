import { IDesignation } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const DesignationSchema: Schema = new Schema({
  name: { type: String },
  organizationId: { type: Schema.Types.ObjectId },
  deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

const Designation = mongoose.model<IDesignation>('Designation', DesignationSchema);

export default Designation;

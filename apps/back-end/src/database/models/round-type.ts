import { IRound_type } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const Round_typeSchema: Schema = new Schema({
    name: { type: String },
    organizationId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const Round_type = mongoose.model<IRound_type>('Round_type', Round_typeSchema);

export default Round_type;
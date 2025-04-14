import { ITrainingEnrollment } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const TrainingEnrollmentSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date },
    progress: { type: Number, default: 0 },
    trainingId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false, });

const TrainingEnrollment = mongoose.model<ITrainingEnrollment>('Training_enrollment', TrainingEnrollmentSchema);

export default TrainingEnrollment;
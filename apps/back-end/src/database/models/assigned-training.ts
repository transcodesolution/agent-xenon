import { IAssignedTraining } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const AssignedTrainingSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", index: true },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date },
    progress: { type: Number, default: 0 },
    trainingId: { type: Schema.Types.ObjectId, index: true },
    submittedAnswers: { type: [{ answer: { type: String }, questionId: { type: Schema.Types.ObjectId }, sectionId: { type: Schema.Types.ObjectId } }] },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true, versionKey: false,
    toJSON: {
        virtuals: true,
    },
    virtuals: {
        employee: {
            options: {
                ref: 'Employee',
                localField: 'employeeId',
                foreignField: '_id',
                justOne: true,
                match: { deletedAt: null }
            }
        },
    }
});

const AssignedTraining = mongoose.model<IAssignedTraining>('Assigned_training', AssignedTrainingSchema);

export default AssignedTraining;
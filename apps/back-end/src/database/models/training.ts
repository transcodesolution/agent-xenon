import { TrainingLevel } from '@agent-xenon/constants';
import { ITraining } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const TrainingSchema: Schema = new Schema({
    name: { type: String },
    description: { type: String },
    tags: { type: [String], default: [] },
    level: { type: String, enum: TrainingLevel },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    topicIds: { type: [{ type: Schema.Types.ObjectId, }], default: [] },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true, versionKey: false,
    toJSON: {
        virtuals: true
    },
    virtuals: {
        topics: {
            options: {
                ref: 'Topic',
                localField: 'topicIds',
                foreignField: '_id',
                match: { deletedAt: null }
            }
        },
        assignees: {
            options: {
                ref: 'Assigned_training',
                localField: '_id',
                foreignField: 'trainingId',
                match: { deletedAt: null }
            }
        },
    }
});

const Training = mongoose.model<ITraining>('Training', TrainingSchema);

export default Training;
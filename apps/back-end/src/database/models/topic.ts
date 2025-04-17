import { TopicSectionType } from '@agent-xenon/constants';
import { ITopic } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const TopicSchema: Schema = new Schema({
    name: { type: String },
    description: { type: String },
    trainingId: { type: Schema.Types.ObjectId, index: true },
    topicSections: [{
        content: { type: String },
        name: { type: String },
        order: { type: Number },
        topicSectionConfig: {
            practical: {
                questions: [{
                    questionId: { type: Schema.Types.ObjectId },
                }],
            },
            text: {
                text: { type: String },
            },
            video: {
                videoDescription: { type: String },
                videoTitle: { type: String },
                videoURL: { type: String },
            },
            assistent: {
                prompt: { type: String },
            },
            audio: {
                audioDescription: { type: String },
                audioTitle: { type: String },
                audioURL: { type: String },
            },
        },
        type: { type: String, enum: TopicSectionType },
    }],
    parentTopicId: { type: Schema.Types.ObjectId, default: null, index: true },
    deletedAt: { type: Date, default: null, index: true },
}, {
    timestamps: true, versionKey: false, toJSON: {
        virtuals: true
    },
    virtuals: {
        childTopics: {
            options: {
                ref: 'Topic',
                localField: '_id',
                foreignField: 'parentTopicId',
                match: { deletedAt: null }
            }
        },
    }
});

const Topic = mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;
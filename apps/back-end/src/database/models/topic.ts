import { TopicSectionType } from '@agent-xenon/constants';
import { ITopic } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const defaultValue = "";

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
                text: { type: String, default: defaultValue },
            },
            video: {
                videoDescription: { type: String, default: defaultValue },
                videoTitle: { type: String, default: defaultValue },
                videoURL: { type: String, default: defaultValue },
            },
            assistent: {
                prompt: { type: String, default: defaultValue },
            },
            audio: {
                audioDescription: { type: String, default: defaultValue },
                audioTitle: { type: String, default: defaultValue },
                audioURL: { type: String, default: defaultValue },
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
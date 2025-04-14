import { TopicSectionType } from '@agent-xenon/constants';
import { ITopic } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const TopicSchema: Schema = new Schema({
    name: { type: String },
    description: { type: String },
    trainingId: { type: Schema.Types.ObjectId },
    sections: [{
        assistent: {
            prompt: { type: String },
        },
        audio: {
            audioDescription: { type: String },
            audioTitle: { type: String },
            audioURL: { type: String },
        },
        content: { type: String },
        name: { type: String },
        order: { type: Number },
        practical: {
            questions: [{
                questionId: { type: Schema.Types.ObjectId },
            }],
        },
        text: {
            text: { type: String },
        },
        type: { type: String, enum: TopicSectionType },
        video: {
            videoDescription: { type: String },
            videoTitle: { type: String },
            videoURL: { type: String },
        },
    }],
    parentTopicId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false, });

const Topic = mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const InterviewQuestionAnswerSchema: Schema = new Schema({
    description: { type: String },
    type: { type: String, enum: ['mcq', 'dsa', 'coding', 'system_design', 'low_level_design', 'other', 'behavioral'] },
    question: { type: String },
    text: { type: String },
    answerDetails: {
        codeText: { type: String },
        options: [{ type: String }],
        text: { type: String },
    },
    options: [{ type: String, enum: ['a', 'b', 'c', 'd'] }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    timeLimitInMinutes: { type: Number },
    evaluationCriteria: { type: String },
    isAutomated: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId },
    inputFormat: { type: String, enum: ['text', 'mcq', 'file', 'code'] },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

const InterviewQuestionAnswer = mongoose.model<IInterviewQuestionAnswer>('InterviewQuestionAnswer', InterviewQuestionAnswerSchema);

export default InterviewQuestionAnswer;

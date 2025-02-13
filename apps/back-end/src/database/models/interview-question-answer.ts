import { AnswerInputFormat, AnswerMcqOptionFormat, Difficulty, TechnicalRoundTypes } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const InterviewQuestionAnswerSchema: Schema = new Schema({
    description: { type: String },
    type: { type: String, enum: TechnicalRoundTypes, default: TechnicalRoundTypes.MCQ },
    question: { type: String },
    promptText: { type: String },
    answerDetails: {
        codeText: { type: String },
        text: { type: String },
    },
    options: [{ type: { text: String, index: { type: String, enum: AnswerMcqOptionFormat } } }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: Difficulty },
    timeLimitInMinutes: { type: Number },
    evaluationCriteria: { type: String },
    isAutomated: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId },
    inputFormat: { type: String, enum: AnswerInputFormat, default: TechnicalRoundTypes.MCQ },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

const InterviewQuestionAnswer = mongoose.model<IInterviewQuestionAnswer>('InterviewQuestionAnswer', InterviewQuestionAnswerSchema);

export default InterviewQuestionAnswer;

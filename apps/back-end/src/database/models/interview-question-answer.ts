import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty, InterviewRoundTypes } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const InterviewQuestionAnswerSchema: Schema = new Schema({
    description: { type: String },
    type: { type: String, enum: InterviewRoundTypes, default: InterviewRoundTypes.ASSESSMENT },
    question: { type: String },
    options: [{ type: { text: String, index: { type: String, enum: AnswerMcqOptionFormat }, isRightAnswer: { type: Boolean } } }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: Difficulty },
    timeLimitInMinutes: { type: Number },
    evaluationCriteria: { type: String },
    isAutomated: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId },
    questionFormat: { type: String, enum: AnswerQuestionFormat, default: AnswerQuestionFormat.MCQ },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

const InterviewQuestionAnswer = mongoose.model<IInterviewQuestionAnswer>('InterviewQuestionAnswer', InterviewQuestionAnswerSchema);

export default InterviewQuestionAnswer;

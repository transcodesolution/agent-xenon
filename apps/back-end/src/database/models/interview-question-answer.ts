import { ANSWER_INPUT_FORMAT, ANSWER_MCQ_OPTION, TECHNICAL_QUESTION_ANSWER_TYPES } from '@agent-xenon/constants';
import { AnswerInputFormat, Difficulty, IInterviewQuestionAnswer, TechnicalQuestionAnswerTypes } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const InterviewQuestionAnswerSchema: Schema = new Schema({
    description: { type: String },
    type: { type: String, enum: TechnicalQuestionAnswerTypes, default: TECHNICAL_QUESTION_ANSWER_TYPES.MCQ },
    question: { type: String },
    promptText: { type: String },
    answerDetails: {
        codeText: { type: String },
        text: { type: String },
    },
    options: [{ type: { text: String, index: { type: String, enum: Object.values(ANSWER_MCQ_OPTION) } } }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: Difficulty },
    timeLimitInMinutes: { type: Number },
    evaluationCriteria: { type: String },
    isAutomated: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId },
    inputFormat: { type: String, enum: AnswerInputFormat, default: ANSWER_INPUT_FORMAT.MCQ },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

const InterviewQuestionAnswer = mongoose.model<IInterviewQuestionAnswer>('InterviewQuestionAnswer', InterviewQuestionAnswerSchema);

export default InterviewQuestionAnswer;

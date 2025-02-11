import { ANSWER_INPUT_FORMAT, ANSWER_MCQ_OPTION, DIFFICULTY, INTERVIEW_QUESTION_TYPES } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const InterviewQuestionAnswerSchema: Schema = new Schema({
    description: { type: String },
    type: { type: String, enum: Object.values(INTERVIEW_QUESTION_TYPES), default: INTERVIEW_QUESTION_TYPES.MCQ },
    question: { type: String },
    promptText: { type: String },
    answerDetails: {
        codeText: { type: String },
        text: { type: String },
    },
    options: [{ type: { text: String, index: { type: String, enum: Object.values(ANSWER_MCQ_OPTION) } } }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: Object.values(DIFFICULTY) },
    timeLimitInMinutes: { type: Number },
    evaluationCriteria: { type: String },
    isAutomated: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId },
    inputFormat: { type: String, enum: Object.values(ANSWER_INPUT_FORMAT), default: ANSWER_INPUT_FORMAT.MCQ },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

const InterviewQuestionAnswer = mongoose.model<IInterviewQuestionAnswer>('InterviewQuestionAnswer', InterviewQuestionAnswerSchema);

export default InterviewQuestionAnswer;

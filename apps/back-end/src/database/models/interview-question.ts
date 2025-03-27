import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty, InterviewRoundTypes } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import mongoose, { HydratedDocument, Schema } from 'mongoose';

const InterviewQuestionSchema: Schema = new Schema({
    description: { type: String },
    type: { type: String, enum: InterviewRoundTypes, default: InterviewRoundTypes.ASSESSMENT },
    question: { type: String },
    options: [{ type: { text: String, index: { type: String, enum: AnswerMcqOptionFormat }, isRightAnswer: { type: Boolean }, _id: false }, }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: Difficulty },
    timeLimitInMinutes: { type: Number },
    evaluationCriteria: { type: String },
    isMultiSelectOption: { type: Boolean },
    organizationId: { type: Schema.Types.ObjectId },
    questionFormat: { type: String, enum: AnswerQuestionFormat, default: AnswerQuestionFormat.MCQ },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

InterviewQuestionSchema.post("findOne", (question: HydratedDocument<IInterviewQuestionAnswer>) => {
    if (question) {
        question.set('updatedAt', undefined, { strict: false });
        question.set('deletedAt', undefined, { strict: false });
        question.set('organizationId', undefined, { strict: false });
    }
})

const InterviewQuestion = mongoose.model<IInterviewQuestionAnswer>('InterviewQuestion', InterviewQuestionSchema);

export default InterviewQuestion;

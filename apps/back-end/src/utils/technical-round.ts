import { questionAnswerType, submitExamAnswerPayloadType, submitExamType } from "../types/technical-round";

export const manageMCQAnswers = (questions: submitExamType, questionAnswers: submitExamAnswerPayloadType, mcqCriteria: number) => {
    const correctAnswerCount = questions.filter((i: questionAnswerType, j) => (i.questionId.answerDetails.text === questionAnswers[j].answerDetails.text)).length;

    const applicantPercentage = Math.floor((correctAnswerCount / questions.length) * 100);

    return applicantPercentage >= mcqCriteria;
}
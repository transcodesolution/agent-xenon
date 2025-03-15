import { submitExamAnswerPayloadType, submitExamType } from "../types/technical-round";

export const manageMCQAnswers = (question: submitExamType, answerObj: submitExamAnswerPayloadType) => {
    const answer = answerObj.answer.split("_");

    const correctAnswerCount = question.questionId.options.filter((i, j) => (i.isRightAnswer && answer.includes(i.index))).length;

    const softwareCorrectAnswerCount = question.questionId.options.filter((i) => i.isRightAnswer).length;

    const isCorrectAnswer = correctAnswerCount === softwareCorrectAnswerCount;

    return (isCorrectAnswer ? 1 : 0);
}
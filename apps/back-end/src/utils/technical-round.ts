import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { submitExamAnswerPayloadType, submitExamType } from "../types/technical-round";
import candidateAnswerAnalysisAgent from "../agents/candidate-answer-analysis";
import { OverallResult } from "./enum";

export const manageMCQAnswers = (question: submitExamType, answerObj: submitExamAnswerPayloadType) => {
    const answer = answerObj.answer.split("_");

    const candidateCorrectAnswerCount = question.questionId.options.filter((i) => (i.isRightAnswer && answer.includes(i.index))).length;

    const platformCorrectAnswerCount = question.questionId.options.filter((i) => i.isRightAnswer).length;

    return Number(candidateCorrectAnswerCount === platformCorrectAnswerCount);
}

export const manageTextAndCodeAnswers = async (question: Pick<IInterviewQuestionAnswer, "question" | "evaluationCriteria" | "questionFormat" | "description">, answerObj: submitExamAnswerPayloadType) => {
    const agentResponse = await candidateAnswerAnalysisAgent(question, answerObj.answer);

    return Number(agentResponse.overallStatus === OverallResult.Pass);
}
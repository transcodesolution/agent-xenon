import { IInterviewQuestion } from "@agent-xenon/interfaces";
import { submitExamAnswerPayloadType, submitExamType } from "../types/technical-round";
import candidateAnswerAnalysisAgent from "../agents/candidate-answer-analysis";
import { OverallResult } from "@agent-xenon/constants";
import { config } from "../config";
import { REGEX } from "./constants";

export const manageMCQAnswers = (question: submitExamType, answerObj: submitExamAnswerPayloadType) => {
    const answer = answerObj.answer.split("_");

    const candidateCorrectAnswerCount = question.questionId.options.filter((i) => (i.isRightAnswer && answer.includes(i.index))).length;

    const platformCorrectAnswerCount = question.questionId.options.filter((i) => i.isRightAnswer).length;

    return Number(candidateCorrectAnswerCount === platformCorrectAnswerCount);
}

export const manageTextAndCodeAnswers = async (question: Pick<IInterviewQuestion, "question" | "evaluationCriteria" | "questionFormat" | "description">, answerObj: submitExamAnswerPayloadType) => {
    const agentResponse = await candidateAnswerAnalysisAgent(question, answerObj.answer);

    return Number(agentResponse.overallStatus === OverallResult.Pass);
}

export const updateFrontendDomainUrl = (organizationName: string) => {
    return config.FRONTEND_URL.replace(REGEX.onFindOrganizationNameInFrontendURL, `${organizationName.replace(REGEX.findWhiteSpace, "")}`);
}
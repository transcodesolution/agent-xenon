import { IApiResponse, IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import http from './http-common';
import { IGetInterviewMCQQuestionsRequest } from '@/libs/types-api/src';

export const getInterviewMCQQuestions = async ({roundId}: IGetInterviewMCQQuestionsRequest): Promise<IApiResponse<IInterviewQuestionAnswer[]>> => {
  try {
    const params = { roundId }
    const result = await http.get<IApiResponse<IInterviewQuestionAnswer[]>>(`/exam/questions`, { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching Interview Questions: ${error}`); 
  }
};
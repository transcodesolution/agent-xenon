import { IApiResponse } from '@agent-xenon/interfaces';
import http from './http-common';
import { IGetInterviewMCQQuestionsRequest, IGetInterviewMCQQuestionsResponse, ISubmitExamMCQQuestionsRequest, ISubmitExamMCQQuestionsResponse } from '@/libs/types-api/src';

export const getInterviewMCQQuestions = async ({ roundId }: IGetInterviewMCQQuestionsRequest): Promise<IApiResponse<IGetInterviewMCQQuestionsResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetInterviewMCQQuestionsResponse>>(`/applicant/exam/questions/${roundId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching Interview Questions: ${error}`);
  }
};

export const submitExamMCQQuestions = async (params: ISubmitExamMCQQuestionsRequest): Promise<IApiResponse<ISubmitExamMCQQuestionsResponse>> => {
  try {
    const result = await http.post<IApiResponse<ISubmitExamMCQQuestionsResponse>>('/applicant/exam/submit', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while submit MCQ Questions: ${error}`);
  }
};
import { IApiResponse } from '@agent-xenon/interfaces';
import http from './http-common';
import { ICodeExecuteRequest, ICodeExecuteResponse, IGetInterviewMCQQuestionsRequest, IGetInterviewMCQQuestionsResponse, ISubmitInterviewQuestionsRequest, ISubmitInterviewQuestionsResponse } from '@agent-xenon/types-api';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';

export const getInterviewMCQQuestions = async ({ roundId }: IGetInterviewMCQQuestionsRequest): Promise<IApiResponse<IGetInterviewMCQQuestionsResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetInterviewMCQQuestionsResponse>>(`/applicant/exam/questions/${roundId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching Interview Questions: ${error}`);
  }
};

export const submitExamMCQQuestions = async (params: ISubmitInterviewQuestionsRequest): Promise<IApiResponse<ISubmitInterviewQuestionsResponse>> => {
  try {
    const result = await http.post<IApiResponse<ISubmitInterviewQuestionsResponse>>('/applicant/exam/submit', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while submit MCQ Questions: ${error}`);
  }
};
export const codeExecute = async (params: ICodeExecuteRequest): Promise<IApiResponse<ICodeExecuteResponse>> => {
  try {
    const result = await http.post<IApiResponse<ICodeExecuteResponse>>('/code/execute', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "Compilation Error");
  }
};
import { IApiResponse, IInterviewQuestion, PaginationApiResponseType } from '@agent-xenon/interfaces';
import http from './http-common';
import { IGetQuestionsRequest } from '@/libs/types-api/src';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';

export const getAllMCQQuestions = async (searchString: string): Promise<IApiResponse<Pick<IInterviewQuestion, "question" | "_id">[]>> => {
  try {
    const params = { search: searchString }
    const result = await http.get<IApiResponse<Pick<IInterviewQuestion, "question" | "_id">[]>>(`questionAnswer/all`, { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching MCQs: ${error}`);
  }
};
export const getMCQQuestions = async (params: IGetQuestionsRequest): Promise<IApiResponse<PaginationApiResponseType<IInterviewQuestion[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IInterviewQuestion[]>>>('/questionAnswer', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching MCQs: ${error}`);
  }
};

export const getQuestionById = async (questionId: string): Promise<IApiResponse<IInterviewQuestion>> => {
  try {
    const result = await http.get<IApiResponse<IInterviewQuestion>>(`/questionAnswer/${questionId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching Question by ID: ${error}`);
  }
};

export const createQuestion = async (params: Partial<IInterviewQuestion>): Promise<IApiResponse<IInterviewQuestion>> => {
  try {
    const result = await http.post<IApiResponse<IInterviewQuestion>>('/questionAnswer/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating Question");
  }
};

export const updateQuestion = async (params: Partial<IInterviewQuestion>): Promise<IApiResponse<IInterviewQuestion>> => {
  try {
    const { _id, createdAt, ...otherParams } = params;
    const result = await http.put<IApiResponse<IInterviewQuestion>>(`/questionAnswer/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating Question");
  }
};

export const deleteQuestions = async (questionIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/questionAnswer', { data: { questionIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete question: ${error}`);
  }
};
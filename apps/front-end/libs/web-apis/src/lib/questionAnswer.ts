import { IApiResponse, IInterviewQuestionAnswer, PaginationApiResponseType } from '@agent-xenon/interfaces';
import http from './http-common';
import { IGetQuestionsRequest } from '@/libs/types-api/src';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';

export const getAllMCQQuestions = async (searchString: string): Promise<IApiResponse<Pick<IInterviewQuestionAnswer, "question" | "_id">[]>> => {
  try {
    const params = { search: searchString }
    const result = await http.get<IApiResponse<Pick<IInterviewQuestionAnswer, "question" | "_id">[]>>(`questionAnswer/all`, { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching MCQs: ${error}`);
  }
};
export const getMCQQuestions = async (params: IGetQuestionsRequest): Promise<IApiResponse<PaginationApiResponseType<IInterviewQuestionAnswer[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IInterviewQuestionAnswer[]>>>('/questionAnswer', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching MCQs: ${error}`);
  }
};

export const getQuestionById = async (questionId: string): Promise<IApiResponse<IInterviewQuestionAnswer>> => {
  try {
    const result = await http.get<IApiResponse<IInterviewQuestionAnswer>>(`/questionAnswer/${questionId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching Question by ID: ${error}`);
  }
};

export const createQuestion = async (params: Partial<IInterviewQuestionAnswer>): Promise<IApiResponse<IInterviewQuestionAnswer>> => {
  try {
    const result = await http.post<IApiResponse<IInterviewQuestionAnswer>>('/questionAnswer/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating Question");
  }
};

export const updateQuestion = async (params: Partial<IInterviewQuestionAnswer>): Promise<IApiResponse<IInterviewQuestionAnswer>> => {
  try {
    const { _id, createdAt, ...otherParams } = params;
    const result = await http.put<IApiResponse<IInterviewQuestionAnswer>>(`/questionAnswer/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating Question");
  }
};


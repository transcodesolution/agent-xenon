import { IApiResponse, IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import http from './http-common';

export const getAllMCQQuestions = async (searchString: string): Promise<IApiResponse<Pick<IInterviewQuestionAnswer, "question" | "_id">[]>> => {
  try {
    const params = { search: searchString }
    const result = await http.get<IApiResponse<Pick<IInterviewQuestionAnswer, "question" | "_id">[]>>(`questionAnswer/all`, { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching MCQs: ${error}`);
  }
};

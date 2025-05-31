import http from "./http-common";
import { IApiResponse, ITopic, ITopicSection, ITraining, PaginationApiResponseType } from "@agent-xenon/interfaces";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";
import { IAddOrRemoveEmployeeToTraining, IGetTrainingRequest, ICreateTopicSection } from "@agent-xenon/types-api";

export const getTrainings = async (params: IGetTrainingRequest): Promise<IApiResponse<PaginationApiResponseType<ITraining[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<ITraining[]>>>('/training', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching training: ${error}`);
  }
};

export const getTrainingById = async (trainingId: string): Promise<IApiResponse<ITraining>> => {
  try {
    const result = await http.get<IApiResponse<ITraining>>(`/training/${trainingId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching training by ID: ${error}`);
  }
};

export const createTraining = async (params: Partial<ITraining>): Promise<IApiResponse<ITraining>> => {
  try {
    const result = await http.post<IApiResponse<ITraining>>('/training/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating training");
  }
};

export const updateTraining = async (params: Partial<ITraining>): Promise<IApiResponse<ITraining>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.patch<IApiResponse<ITraining>>(`/training/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating training");
  }
};

export const deleteTrainings = async (trainingIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/training', { data: { trainingIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete training: ${error}`);
  }
};

export const assignEmployeeToTraining = async (params: IAddOrRemoveEmployeeToTraining): Promise<IApiResponse> => {
  try {
    const result = await http.post<IApiResponse>('training/assign', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating training");
  }
};

export const removeEmployeeFromTraining = async (params: IAddOrRemoveEmployeeToTraining): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/training/unassign', { data: params });
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating training");
  }
};

export const getTopics = async (trainingId: string): Promise<IApiResponse<PaginationApiResponseType<ITopic[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<ITopic[]>>>(`/training/${trainingId}/topics`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching topics: ${error}`);
  }
};


export const getTopicById = async (topicId: string): Promise<IApiResponse<ITopic>> => {
  try {
    const result = await http.get<IApiResponse<ITopic>>(`/training/topic/${topicId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching topic by ID: ${error}`);
  }
};

export const createTopic = async (params: Partial<ITopic>): Promise<IApiResponse<ITopic>> => {
  try {
    const result = await http.post<IApiResponse<ITopic>>('/training/topic/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating topic");
  }
};

export const updateTopic = async (params: Partial<ITopic>): Promise<IApiResponse<ITopic>> => {
  try {
    const { _id, ...otherParams } = params
    const result = await http.patch<IApiResponse<ITopic>>(`/training/topic/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating topic");
  }
};

export const deleteTopic = async (topicId: string): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>(`/training/topic/${topicId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete topic: ${error}`);
  }
};

export const createSection = async (params: Partial<ICreateTopicSection>): Promise<IApiResponse<ITopicSection>> => {
  try {
    const result = await http.post<IApiResponse<ITopicSection>>('/training/topic/section/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating section");
  }
};

export const updateSection = async (params: Partial<ICreateTopicSection>): Promise<IApiResponse<ITopicSection>> => {
  try {
    const { _id, topicId, ...otherParams } = params
    const result = await http.patch<IApiResponse<ITopicSection>>(`training/topic/${topicId}/section/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "update section");
  }
};


export const deleteSection = async ({ topicId, sectionId }: { topicId: string; sectionId: string }): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>(`/training/topic/${topicId}/section/${sectionId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete section: ${error}`);
  }
};
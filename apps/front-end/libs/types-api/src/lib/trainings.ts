import { ITopicSection } from "@agent-xenon/interfaces";

export interface IGetTrainingRequest {
  page: number;
  limit: number;
  search: string;
}

export interface IAddOrRemoveEmployeeToTraining {
  trainingId: string;
  employeeId: string;
}
export interface ITrainingId {
  trainingId: string;
}

export interface ICreateTopicSection extends ITopicSection{
  topicId:string
}
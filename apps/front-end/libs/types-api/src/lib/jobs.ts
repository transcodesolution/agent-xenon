import { IJob } from "@agent-xenon/interfaces";

export interface IGetJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  designation?: string;
};


export interface IGetJobsResponse {
  data: {
    jobData: IJob[];
    state: {
      page: number;
      limit: number;
    };
    totalData: number;
  };
  status: number;
  message: string;
}
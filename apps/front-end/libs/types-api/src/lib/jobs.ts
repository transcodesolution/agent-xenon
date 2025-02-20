export interface IGetJobsParams {
  page: number;
  limit: number;
  search: string;
  role?: string;
  designation?: string;
};

interface IRoleDesignation {
  _id: string;
  name: string;
}
export interface IGetJobRoleAndDesignation {
  jobRoleData: IRoleDesignation[];
  designationData: IRoleDesignation[];
}

export interface IDeleteInterviewRoundsRequest {
  roundIds: string[];
}

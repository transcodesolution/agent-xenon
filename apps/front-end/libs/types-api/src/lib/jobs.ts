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
  jobRoles: IRoleDesignation[];
  designations: IRoleDesignation[];
}

export interface IDeleteInterviewRoundsRequest {
  roundIds: string[];
}

export interface IUpdateInterviewRoundStatusRequest {
  jobId: string
  roundId: string
  roundStatus: string
  applicantId?: string
};
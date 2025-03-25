export interface IGetApplicantsRequest {
  jobId: string;
  page: number;
  limit: number;
  search?: string;
  isSelectedByAgent?: boolean;
}
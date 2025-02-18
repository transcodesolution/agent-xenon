import { deleteJobs } from '@/libs/web-apis/src';
import { IApiResponse, IJob } from '@agent-xenon/interfaces';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

interface IDeleteJobsParams {
  jobIds: string[];
}

interface DeleteJobsHookResult {
  deleteJobsMutation: UseMutationResult<IApiResponse<IJob>, Error, IDeleteJobsParams, unknown>;
}

export const useDeleteJobs = (): DeleteJobsHookResult => {
  const deleteJobsMutation = useMutation<IApiResponse<IJob>, Error, IDeleteJobsParams>({
    mutationFn: async ({ jobIds }) => deleteJobs(jobIds),
  });

  return {
    deleteJobsMutation,
  };
};

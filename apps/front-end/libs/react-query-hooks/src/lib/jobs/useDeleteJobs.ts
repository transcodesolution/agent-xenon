import { deleteJobs } from '@/libs/web-apis/src';
import { IApiResponse, IJob } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteJobsParams {
  jobIds: string[];
}

export const useDeleteJobs = () => {
  const deleteJobsMutation = useMutation<IApiResponse, Error, IDeleteJobsParams>({
    mutationFn: async ({ jobIds }) => deleteJobs(jobIds),
  });
  return {
    deleteJobsMutation,
  };
};

import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IJob } from '@agent-xenon/interfaces';
import { updateJob } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateJob = () => {
  return useMutation<IApiResponse<IJob>, AxiosError, Partial<IJob>>({
    mutationKey: ['useUpdateJob'],
    mutationFn: (params) => {
      return updateJob(params);
    },
  });
};

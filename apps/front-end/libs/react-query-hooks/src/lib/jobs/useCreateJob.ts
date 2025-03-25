import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IJob } from '@agent-xenon/interfaces';
import { createJob } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useCreateJob = () => {
  return useMutation<IApiResponse<IJob>, AxiosError, Partial<IJob>>({
    mutationKey: ['useCreateJob'],
    mutationFn: (params) => {
      return createJob(params);
    },
  });
};

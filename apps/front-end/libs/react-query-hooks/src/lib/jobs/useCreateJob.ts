import { useMutation } from '@tanstack/react-query';
import { IJob } from '@agent-xenon/interfaces';
import { ICreateJobParams } from '@agent-xenon/types-api';
import { createJob } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useCreateJob = () => {
  return useMutation<IJob, AxiosError, ICreateJobParams>({
    mutationKey: ['useCreateJob'],
    mutationFn: (params) => {
      return createJob(params);
    },
  });
};

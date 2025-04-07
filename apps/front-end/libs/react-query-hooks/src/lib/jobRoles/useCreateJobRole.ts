import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IJobRole } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createJobRole } from '@agent-xenon/web-apis';

export const useCreateJobRole = () => {
  return useMutation<IApiResponse<IJobRole>, AxiosError, Partial<IJobRole>>({
    mutationKey: ['useCreateJobRole'],
    mutationFn: (params) => {
      return createJobRole(params);
    },
  });
};

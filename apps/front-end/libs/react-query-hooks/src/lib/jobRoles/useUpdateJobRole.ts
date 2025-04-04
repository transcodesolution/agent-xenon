import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IJobRole } from '@agent-xenon/interfaces';
import { updateJobRole } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateJobRole = () => {
  return useMutation<IApiResponse<IJobRole>, AxiosError, Partial<IJobRole>>({
    mutationKey: ['useUpdateJobRole'],
    mutationFn: (params) => {
      return updateJobRole(params);
    },
  });
};

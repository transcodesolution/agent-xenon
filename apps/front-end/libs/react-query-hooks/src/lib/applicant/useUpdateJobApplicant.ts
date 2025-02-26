import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IApplicant } from '@agent-xenon/interfaces';
import { updateJobApplicant } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateJobApplicant = () => {
  return useMutation<IApiResponse<IApplicant>, AxiosError, Partial<IApplicant>>({
    mutationKey: ['useUpdateJobApplicant'],
    mutationFn: (params) => {
      return updateJobApplicant(params);
    },
  });
};

import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IApplicant } from '@agent-xenon/interfaces';
import { createJobApplicant } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useCreateJobApplicant = () => {
  return useMutation<IApiResponse<IApplicant>, AxiosError, Partial<IApplicant>>({
    mutationKey: ['useCreateJobApplicant'],
    mutationFn: (params) => {
      return createJobApplicant(params);
    },
  });
};

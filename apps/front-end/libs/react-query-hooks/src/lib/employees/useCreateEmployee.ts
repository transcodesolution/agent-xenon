import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IEmployee } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createEmployee } from '@agent-xenon/web-apis';

export const useCreateEmployee = () => {
  return useMutation<IApiResponse<IEmployee>, AxiosError, Partial<IEmployee>>({
    mutationKey: ['useCreateEmployee'],
    mutationFn: (params) => {
      return createEmployee(params);
    },
  });
};

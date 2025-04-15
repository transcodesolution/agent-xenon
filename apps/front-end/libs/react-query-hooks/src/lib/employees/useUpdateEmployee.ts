import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IEmployee } from '@agent-xenon/interfaces';
import { updateEmployee } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateEmployee = () => {
  return useMutation<IApiResponse<IEmployee>, AxiosError, Partial<IEmployee>>({
    mutationKey: ['useUpdateEmployee'],
    mutationFn: (params) => {
      return updateEmployee(params);
    },
  });
};

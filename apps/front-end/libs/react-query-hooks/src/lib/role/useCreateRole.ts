import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IRole } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createRole } from '@agent-xenon/web-apis';

export const useCreateRole = () => {
  return useMutation<IApiResponse<IRole>, AxiosError, Partial<IRole>>({
    mutationKey: ['useCreateRole'],
    mutationFn: (params) => {
      return createRole(params);
    },
  });
};

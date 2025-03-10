import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IRole } from '@agent-xenon/interfaces';
import { updateRole } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateRole = () => {
  return useMutation<IApiResponse<IRole>, AxiosError, Partial<IRole>>({
    mutationKey: ['useUpdateRole'],
    mutationFn: (params) => {
      return updateRole(params);
    },
  });
};

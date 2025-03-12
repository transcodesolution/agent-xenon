import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IUser } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createUser } from '@agent-xenon/web-apis';

export const useCreateUser = () => {
  return useMutation<IApiResponse<IUser>, AxiosError, Partial<IUser>>({
    mutationKey: ['useCreateUser'],
    mutationFn: (params) => {
      return createUser(params);
    },
  });
};
import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IUser } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createUser } from '@agent-xenon/web-apis';
import { IUpdateUserResponse } from '@/libs/types-api/src';

export const useCreateUser = () => {
  return useMutation<IApiResponse<IUpdateUserResponse>, AxiosError, Partial<IUser>>({
    mutationKey: ['useCreateUser'],
    mutationFn: (params) => {
      return createUser(params);
    },
  });
};
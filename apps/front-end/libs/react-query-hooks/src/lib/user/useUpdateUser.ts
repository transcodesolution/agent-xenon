import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IUser } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { updateUser } from '@/libs/web-apis/src';
import { IUpdateUserResponse } from '@/libs/types-api/src';

export const useUpdateUser = () => {
  return useMutation<IApiResponse<IUpdateUserResponse>, AxiosError, Partial<IUser>>({
    mutationKey: ['useUpdateUser'],
    mutationFn: (params) => {
      return updateUser(params);
    },
  });
};
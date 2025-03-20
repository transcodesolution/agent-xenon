import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { connectApp } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useGetConnectApp = () => {
  return useMutation<IApiResponse<string>, AxiosError, string>({
    mutationKey: ['useGetConnectApp'],
    mutationFn: (params) => {
      return connectApp(params);
    },
  });
};

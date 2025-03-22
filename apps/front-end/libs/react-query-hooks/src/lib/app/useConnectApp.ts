import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { connectApp } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { IConnectAppRequest, IConnectAppResponse } from '@/libs/types-api/src/lib/app';

export const useConnectApp = () => {
  return useMutation<IApiResponse<IConnectAppResponse>, AxiosError, IConnectAppRequest>({
    mutationKey: ['useGetConnectApp'],
    mutationFn: (params) => {
      return connectApp(params);
    },
  });
};
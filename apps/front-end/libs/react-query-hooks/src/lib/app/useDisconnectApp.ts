import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { disconnectApp } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { IDisConnectAppRequest } from '@/libs/types-api/src/lib/app';

export const useDisconnectApp = () => {
  return useMutation<IApiResponse<string>, AxiosError, IDisConnectAppRequest>({
    mutationKey: ['useGetDisconnectApp'],
    mutationFn: (params) => {
      return disconnectApp(params);
    },
  });
};

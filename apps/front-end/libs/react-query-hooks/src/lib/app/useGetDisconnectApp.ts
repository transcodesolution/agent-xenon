import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { disconnectApp } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useGetDisconnectApp = () => {
  return useMutation<IApiResponse<string>, AxiosError, string>({
    mutationKey: ['useGetDisconnectApp'],
    mutationFn: (params) => {
      return disconnectApp(params);
    },
  });
};

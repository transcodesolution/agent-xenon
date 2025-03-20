import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { updateRoundStatus } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { IUpdateInterviewRoundStatusRequest } from '@/libs/types-api/src';

export const useInterviewRoundUpdateStatus = () => {
  return useMutation<IApiResponse, AxiosError, IUpdateInterviewRoundStatusRequest>({
    mutationKey: ['updateRoundStatus'],
    mutationFn: (params) => {
      return updateRoundStatus(params);
    },
  });
};

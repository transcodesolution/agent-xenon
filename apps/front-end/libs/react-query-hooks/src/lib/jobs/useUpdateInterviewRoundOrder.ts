import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRound } from '@agent-xenon/interfaces';
import { updateInterviewRoundOrder } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { IInterviewRoundUpdateOrder } from '@/libs/types-api/src';

export const useUpdateInterviewRoundOrder = () => {
  return useMutation<IApiResponse<IInterviewRound>, AxiosError, IInterviewRoundUpdateOrder>({
    mutationKey: ['updateOrder'],
    mutationFn: (params) => {
      return updateInterviewRoundOrder(params);
    },
  });
};
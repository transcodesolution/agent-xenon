import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRound } from '@agent-xenon/interfaces';
import { updateInterviewRound } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateInterviewRound = () => {
  return useMutation<IApiResponse<IInterviewRound>, AxiosError, Partial<IInterviewRound>>({
    mutationKey: ['updateInterviewRound'],
    mutationFn: (params) => {
      return updateInterviewRound(params);
    },
  });
};

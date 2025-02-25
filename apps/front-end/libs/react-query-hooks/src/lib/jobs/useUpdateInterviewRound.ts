import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRounds } from '@agent-xenon/interfaces';
import { updateInterviewRound } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateInterviewRound = () => {
  return useMutation<IApiResponse<IInterviewRounds>, AxiosError, Partial<IInterviewRounds>>({
    mutationKey: ['updateInterviewRound'],
    mutationFn: (params) => {
      return updateInterviewRound(params);
    },
  });
};

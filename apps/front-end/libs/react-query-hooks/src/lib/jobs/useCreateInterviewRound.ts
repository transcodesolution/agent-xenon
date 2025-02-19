import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRounds } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createInterviewRound } from '@agent-xenon/web-apis';

export const useCreateInterviewRound = () => {
  return useMutation<IApiResponse<IInterviewRounds>, AxiosError, Partial<IInterviewRounds>>({
    mutationKey: ['useCreateInterviewRound'],
    mutationFn: (params) => createInterviewRound(params),
  });
};

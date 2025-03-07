import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRound } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createInterviewRound } from '@agent-xenon/web-apis';

export const useCreateInterviewRound = () => {
  return useMutation<IApiResponse<IInterviewRound>, AxiosError, Partial<IInterviewRound>>({
    mutationKey: ['useCreateInterviewRound'],
    mutationFn: (params) => createInterviewRound(params),
  });
};

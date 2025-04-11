import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewQuestion } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createQuestion } from '@agent-xenon/web-apis';

export const useCreateQuestion = () => {
  return useMutation<IApiResponse<IInterviewQuestion>, AxiosError, Partial<IInterviewQuestion>>({
    mutationKey: ['useCreateQuestion'],
    mutationFn: (params) => {
      return createQuestion(params);
    },
  });
};

import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createQuestion } from '@agent-xenon/web-apis';

export const useCreateQuestion = () => {
  return useMutation<IApiResponse<IInterviewQuestionAnswer>, AxiosError, Partial<IInterviewQuestionAnswer>>({
    mutationKey: ['useCreateQuestion'],
    mutationFn: (params) => {
      return createQuestion(params);
    },
  });
};

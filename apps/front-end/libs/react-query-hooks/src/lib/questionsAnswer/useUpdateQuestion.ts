import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import { updateQuestion } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateQuestion = () => {
  return useMutation<IApiResponse<IInterviewQuestionAnswer>, AxiosError, Partial<IInterviewQuestionAnswer>>({
    mutationKey: ['useUpdateQuestion'],
    mutationFn: (params) => {
      return updateQuestion(params);
    },
  });
};

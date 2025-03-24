import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { submitExamMCQQuestions } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { ISubmitInterviewQuestionsRequest, ISubmitInterviewQuestionsResponse } from '@/libs/types-api/src';

export const useSubmitInterviewQuestions = () => {
  return useMutation<IApiResponse<ISubmitInterviewQuestionsResponse>, AxiosError, ISubmitInterviewQuestionsRequest>({
    mutationKey: ['submitExamMCQQuestions'],
    mutationFn: (params) => {
      return submitExamMCQQuestions(params);
    },
  });
};
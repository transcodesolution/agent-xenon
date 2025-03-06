import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { submitExamMCQQuestions } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { ISubmitExamMCQQuestionsRequest, ISubmitExamMCQQuestionsResponse } from '@/libs/types-api/src';

export const useSubmitExamMCQQuestions = () => {
  return useMutation<IApiResponse<ISubmitExamMCQQuestionsResponse>, AxiosError, ISubmitExamMCQQuestionsRequest>({
    mutationKey: ['submitExamMCQQuestions'],
    mutationFn: (params) => {
      return submitExamMCQQuestions(params);
    },
  });
};
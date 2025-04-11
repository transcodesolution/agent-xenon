import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewQuestion } from '@agent-xenon/interfaces';
import { updateQuestion } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateQuestion = () => {
  return useMutation<IApiResponse<IInterviewQuestion>, AxiosError, Partial<IInterviewQuestion>>({
    mutationKey: ['useUpdateQuestion'],
    mutationFn: (params) => {
      return updateQuestion(params);
    },
  });
};

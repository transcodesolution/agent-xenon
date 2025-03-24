import { deleteQuestions } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteQuestionsParams {
  questionIds: string[];
}

export const useDeleteQuestions = () => {
  const deleteQuestionsMutation = useMutation<IApiResponse, Error, IDeleteQuestionsParams>({
    mutationFn: async ({ questionIds }) => deleteQuestions(questionIds),
  });
  return {
    deleteQuestionsMutation,
  };
};

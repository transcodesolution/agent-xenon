import { deleteInterviewRounds } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteInterviewRoundsParams {
  roundIds: string[];
}

export const useDeleteInterviewRounds = () => {
  const deleteInterviewRoundMutation = useMutation<IApiResponse, Error, IDeleteInterviewRoundsParams>({
    mutationFn: async ({ roundIds }) => deleteInterviewRounds(roundIds),
  });
  return {
    deleteInterviewRoundMutation,
  };
};

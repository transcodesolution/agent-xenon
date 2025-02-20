import { deleteInterviewRounds } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';
import { IDeleteInterviewRoundsRequest } from '@agent-xenon/types-api';

export const useDeleteInterviewRounds = () => {
  const deleteInterviewRoundMutation = useMutation<IApiResponse, Error, IDeleteInterviewRoundsRequest>({
    mutationFn: async ({ roundIds }) => deleteInterviewRounds(roundIds),
  });
  return {
    deleteInterviewRoundMutation,
  };
};

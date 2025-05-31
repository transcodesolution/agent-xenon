import { deleteTrainings } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteTrainingsParams {
  trainingIds: string[];
}

export const useDeleteTrainings = () => {
  const deleteTrainingsMutation = useMutation<IApiResponse, Error, IDeleteTrainingsParams>({
    mutationFn: async ({ trainingIds }) => deleteTrainings(trainingIds),
  });
  return {
    deleteTrainingsMutation,
  };
};

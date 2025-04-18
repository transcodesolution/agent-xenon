import { getTrainingById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetTrainingById = ({
  trainingId
}: { trainingId: string }) => {
  return useQuery({
    queryKey: ['getTrainingById', trainingId],
    queryFn: async () => getTrainingById(trainingId),
    refetchOnWindowFocus: false,
  });
};

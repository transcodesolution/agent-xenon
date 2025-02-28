import { getInterviewRoundsById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetInterviewRoundsById = ({
  roundId
}: { roundId: string }) => {
  return useQuery({
    queryKey: ['getInterviewRoundsById', roundId],
    queryFn: async () => getInterviewRoundsById(roundId),
    enabled: !!roundId,
    refetchOnWindowFocus: false,
  });
};

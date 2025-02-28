import { getInterviewRoundsByJobId } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetInterviewRoundsByJobId = ({
  jobId
}: { jobId: string }) => {
  return useQuery({
    queryKey: ['getInterviewRoundsByJobId', jobId],
    queryFn: async () => getInterviewRoundsByJobId(jobId),
    enabled: !!jobId,
    refetchOnWindowFocus: false,
  });
};

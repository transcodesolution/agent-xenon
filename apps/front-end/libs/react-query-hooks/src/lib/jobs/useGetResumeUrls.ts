import { getResumeUrls } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetResumeUrls {
  jobId: string
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetResumeUrls = ({
  jobId,
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetResumeUrls) => {
  return useQuery({
    queryKey: ['getResumeUrls', jobId],
    queryFn: async () => {
      return getResumeUrls(jobId);
    },
    enabled: enabled,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};
import { getApps } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetApps {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetApps = ({
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetApps) => {
  return useQuery({
    queryKey: ['getApplicants'],
    queryFn: async () => {
      return getApps();
    },
    enabled: enabled,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};
import { IGetJobsParams } from '@/libs/types-api/src';
import { getJobs } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetJobs extends IGetJobsParams {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetJobs = ({
  page,
  limit,
  search = '',
  role = '',
  designation = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetJobs) => {
  return useQuery({
    queryKey: ['getJobs', page, limit, search, role, designation],
    queryFn: async () => {
      return getJobs({
        page,
        limit,
        search,
      });
    },
    enabled: enabled,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};
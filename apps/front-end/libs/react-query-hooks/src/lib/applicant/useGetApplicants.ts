import { IGetApplicantsRequest } from '@agent-xenon/types-api';
import { getApplicants } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetApplicants extends IGetApplicantsRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetApplicants = ({
  page,
  limit,
  search = '',
  jobId = '',
  isSelectedByAgent,
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetApplicants) => {
  return useQuery({
    queryKey: ['getApplicants', page, limit, search, jobId, isSelectedByAgent],
    queryFn: async () => {
      return getApplicants({
        page,
        limit,
        search,
        jobId,
        isSelectedByAgent,
      });
    },
    enabled: enabled,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};
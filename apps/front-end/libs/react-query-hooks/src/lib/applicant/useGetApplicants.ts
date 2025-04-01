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
  jobId,
  isSelectedByAgent,
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetApplicants) => {
  const params: IGetApplicantsRequest = {
    page,
    limit,
    search,
    ...(jobId !== undefined && jobId !== null ? { jobId } : {}),
    ...(isSelectedByAgent !== undefined ? { isSelectedByAgent } : {}),
  };

  return useQuery({
    queryKey: ['getApplicants', page, limit, search, jobId, isSelectedByAgent],
    queryFn: async () => getApplicants(params),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};
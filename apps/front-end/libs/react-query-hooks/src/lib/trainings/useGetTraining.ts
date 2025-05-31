
import { IGetTrainingRequest } from '@agent-xenon/types-api';
import { getTrainings } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetTrainings extends IGetTrainingRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetTrainings = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetTrainings) => {
  return useQuery({
    queryKey: ['getTrainings', page, limit, search],
    queryFn: async () => {
      return getTrainings({
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
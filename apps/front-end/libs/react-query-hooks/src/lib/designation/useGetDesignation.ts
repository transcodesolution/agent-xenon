
import { IGetDesignationRequest } from '@agent-xenon/types-api';
import { getDesignations } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetDesignations extends IGetDesignationRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetDesignations = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetDesignations) => {
  return useQuery({
    queryKey: ['getDesignations', page, limit, search],
    queryFn: async () => {
      return getDesignations({
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
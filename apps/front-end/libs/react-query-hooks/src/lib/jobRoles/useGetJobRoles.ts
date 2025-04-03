
import { IGetRolesRequest } from '@agent-xenon/types-api';
import { getJobRoles } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetJobRoles extends IGetRolesRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetJobRoles = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetJobRoles) => {
  return useQuery({
    queryKey: ['getJobRoles', page, limit, search],
    queryFn: async () => {
      return getJobRoles({
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
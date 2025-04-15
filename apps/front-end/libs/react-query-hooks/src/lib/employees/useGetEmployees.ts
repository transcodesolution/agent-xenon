
import { IGetEmployeeRequest } from '@agent-xenon/types-api';
import { getEmployees } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetEmployees extends IGetEmployeeRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetEmployees = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetEmployees) => {
  return useQuery({
    queryKey: ['getEmployees', page, limit, search],
    queryFn: async () => {
      return getEmployees({
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
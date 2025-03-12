import { IGetUsersRequest } from '@/libs/types-api/src';
import { getUsers } from '@/libs/web-apis/src/lib/user';
import { useQuery } from '@tanstack/react-query';

interface IUseGetUsers extends IGetUsersRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetUsers = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetUsers) => {
  return useQuery({
    queryKey: ['getUsers', page, limit, search],
    queryFn: async () => getUsers({ limit, page, search }),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};
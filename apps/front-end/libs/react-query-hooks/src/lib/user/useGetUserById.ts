import { IGetUserByIdRequest } from '@/libs/types-api/src';
import { getUserById } from '@/libs/web-apis/src/lib/user';
import { useQuery } from '@tanstack/react-query';

interface IUseGetUser extends IGetUserByIdRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetUserById = ({
  id,
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetUser) => {
  return useQuery({
    queryKey: ['getUserById', id],
    queryFn: async () => getUserById({ id }),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};
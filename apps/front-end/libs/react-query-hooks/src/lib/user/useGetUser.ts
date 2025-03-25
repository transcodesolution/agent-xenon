import { getUser } from '@/libs/web-apis/src/lib/user';
import { useQuery } from '@tanstack/react-query';

interface IUseGetUser {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetUser = ({
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetUser) => {
  return useQuery({
    queryKey: ['getUser'],
    queryFn: async () => getUser(),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};

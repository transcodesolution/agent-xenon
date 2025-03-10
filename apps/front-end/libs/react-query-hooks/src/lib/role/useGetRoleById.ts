import { getRoleById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetRoleById = ({
  roleId
}: { roleId: string }) => {
  return useQuery({
    queryKey: ['getRoleById', roleId],
    queryFn: async () => getRoleById(roleId),
    refetchOnWindowFocus: false,
  });
};

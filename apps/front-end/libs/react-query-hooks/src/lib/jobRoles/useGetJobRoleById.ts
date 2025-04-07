import { getJobRoleById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetJobRoleById = ({
  jobRoleId
}: { jobRoleId: string }) => {
  return useQuery({
    queryKey: ['getJobRoleById', jobRoleId],
    queryFn: async () => getJobRoleById(jobRoleId),
    refetchOnWindowFocus: false,
  });
};

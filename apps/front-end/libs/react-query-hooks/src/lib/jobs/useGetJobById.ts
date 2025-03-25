import { getJobById } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

export const useGetJobById = ({
  jobId
}: { jobId: string }) => {
  return useQuery({
    queryKey: ['getJobById', jobId],
    queryFn: async () => getJobById(jobId),
    refetchOnWindowFocus: false,
  });
};

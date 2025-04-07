import { getApplicantAppliedJobsById } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

export const useGetApplicantAppliedJobsById = ({
  applicantId
}: { applicantId: string }) => {
  return useQuery({
    queryKey: ['getApplicantAppliedJobsById', applicantId],
    queryFn: async () => getApplicantAppliedJobsById(applicantId),
    refetchOnWindowFocus: false,
  });
};

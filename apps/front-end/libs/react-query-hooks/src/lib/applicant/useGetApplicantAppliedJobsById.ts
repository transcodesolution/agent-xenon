import { getAppliedJobsByApplicantId } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

export const useGetApplicantAppliedJobsById = ({
  applicantId
}: { applicantId: string }) => {
  return useQuery({
    queryKey: ['getAppliedJobsByApplicantId', applicantId],
    queryFn: async () => getAppliedJobsByApplicantId(applicantId),
    refetchOnWindowFocus: false,
  });
};

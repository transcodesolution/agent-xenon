import { getApplicantById } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

export const useGetApplicantById = ({
  applicantId
}: { applicantId: string }) => {
  return useQuery({
    queryKey: ['getApplicantById', applicantId],
    queryFn: async () => getApplicantById(applicantId),
    refetchOnWindowFocus: false,
  });
};

import { getApplicantInterviewRounds } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetApplicantInterviewRounds = ({
  applicantId
}: { applicantId: string }) => {
  return useQuery({
    queryKey: ['getApplicantInterviewDetail', applicantId],
    queryFn: async () => getApplicantInterviewRounds(applicantId),
    refetchOnWindowFocus: false,
  });
};

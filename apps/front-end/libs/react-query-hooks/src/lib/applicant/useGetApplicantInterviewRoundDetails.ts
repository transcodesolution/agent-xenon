import { useQuery } from '@tanstack/react-query';
import { getApplicantInterviewRoundDetails } from '@/libs/web-apis/src';

interface IUseGetApplicantInterviewRoundDetail {
  roundId: string;
  applicantId: string;
  enabled: boolean;
}

export const useGetApplicantInterviewRoundDetails = ({
  roundId,
  applicantId,
  enabled,
}: IUseGetApplicantInterviewRoundDetail) => {
  return useQuery({
    queryKey: ['getApplicantInterviewRoundDetails', roundId, applicantId],
    queryFn: async () => getApplicantInterviewRoundDetails({ roundId, applicantId }),
    enabled,
    refetchOnWindowFocus: false,
  });
};
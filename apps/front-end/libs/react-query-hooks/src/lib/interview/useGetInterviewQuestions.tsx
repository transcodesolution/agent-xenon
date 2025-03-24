import { IGetInterviewMCQQuestionsRequest } from '@/libs/types-api/src';
import { getInterviewMCQQuestions } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

interface IUseGetInterviewMCQQuestions extends IGetInterviewMCQQuestionsRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetInterviewQuestions = ({
  roundId,
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetInterviewMCQQuestions) => {
  return useQuery({
    queryKey: ['getInterviewMCQQuestions', roundId],
    queryFn: async () => {
      return getInterviewMCQQuestions({
        roundId
      });
    },
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};
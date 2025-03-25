import { getQuestionById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetQuestionById = ({
  questionId
}: { questionId: string }) => {
  return useQuery({
    queryKey: ['getQuestionById', questionId],
    queryFn: async () => getQuestionById(questionId),
    refetchOnWindowFocus: false,
  });
};

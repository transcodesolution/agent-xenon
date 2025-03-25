import { IGetQuestionsRequest } from '@/libs/types-api/src';
import { getMCQQuestions } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

interface IUseGetMCQQuestions extends IGetQuestionsRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetMCQQuestions = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetMCQQuestions) => {
  return useQuery({
    queryKey: ['getMCQQuestions', page, limit, search],
    queryFn: async () => {
      return getMCQQuestions({
        page,
        limit,
        search,
      });
    },
    enabled: enabled,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};
import { getAllMCQQuestions } from "@agent-xenon/web-apis";
import { useQuery } from "@tanstack/react-query";

interface IUseGetMCQQuestions {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  searchString: string;
};
export const useGetAllMCQQuestions = ({
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
  searchString
}: IUseGetMCQQuestions) => {
  return useQuery({
    queryKey: ['getAllMCQQuestions', searchString],
    queryFn: async () => {
      return getAllMCQQuestions(searchString);
    },
    enabled: enabled && !!searchString,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};
import { getUnassignedEmployees } from "@agent-xenon/web-apis";
import { useQuery } from "@tanstack/react-query";

interface IUseGetUnassignedEmployees {
  trainingId: string;
  searchString: string;
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}

export const useGetUnassignedEmployees = ({
  trainingId,
  searchString,
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetUnassignedEmployees) => {
  return useQuery({
    queryKey: ['getUnassignedEmployees', trainingId, searchString],
    queryFn: async () => getUnassignedEmployees({ trainingId, search: searchString }),
    enabled: enabled && !!searchString && !!trainingId,
    staleTime,
    refetchOnWindowFocus,
  });
};

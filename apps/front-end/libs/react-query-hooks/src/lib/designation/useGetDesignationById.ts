import { getDesignationById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetDesignationById = ({
  designationId
}: { designationId: string }) => {
  return useQuery({
    queryKey: ['getDesignationById', designationId],
    queryFn: async () => getDesignationById(designationId),
    refetchOnWindowFocus: false,
  });
};

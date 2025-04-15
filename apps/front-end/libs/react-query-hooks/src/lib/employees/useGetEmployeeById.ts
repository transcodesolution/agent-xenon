import { getEmployeeById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetEmployeeById = ({
  employeeId
}: { employeeId: string }) => {
  return useQuery({
    queryKey: ['getEmployeeById', employeeId],
    queryFn: async () => getEmployeeById(employeeId),
    refetchOnWindowFocus: false,
  });
};

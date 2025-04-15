import { deleteEmployees } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteEmployeesParams {
  employeeIds: string[];
}

export const useDeleteEmployees = () => {
  const deleteEmployeesMutation = useMutation<IApiResponse, Error, IDeleteEmployeesParams>({
    mutationFn: async ({ employeeIds }) => deleteEmployees(employeeIds),
  });
  return {
    deleteEmployeesMutation,
  };
};

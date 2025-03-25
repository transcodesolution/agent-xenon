import { deleteRoles } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteRolesParams {
  roleIds: string[];
}

export const useDeleteRoles = () => {
  const deleteRolesMutation = useMutation<IApiResponse, Error, IDeleteRolesParams>({
    mutationFn: async ({ roleIds }) => deleteRoles(roleIds),
  });
  return {
    deleteRolesMutation,
  };
};

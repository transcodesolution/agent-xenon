import { deleteJobRoles } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteJobRolesParams {
  jobRoleIds: string[];
}

export const useDeleteJobRoles = () => {
  const deleteJobRolesMutation = useMutation<IApiResponse, Error, IDeleteJobRolesParams>({
    mutationFn: async ({ jobRoleIds }) => deleteJobRoles(jobRoleIds),
  });
  return {
    deleteJobRolesMutation,
  };
};

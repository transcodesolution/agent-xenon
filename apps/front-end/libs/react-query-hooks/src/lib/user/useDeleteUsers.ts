import { deleteUsers } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteUsersParams {
  userIds: string[];
}

export const useDeleteUsers = () => {
  const deleteUsersMutation = useMutation<IApiResponse, Error, IDeleteUsersParams>({
    mutationFn: async ({ userIds }) => deleteUsers(userIds),
  });
  return {
    deleteUsersMutation,
  };
};

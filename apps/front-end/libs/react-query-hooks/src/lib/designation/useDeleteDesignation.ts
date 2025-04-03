import { deleteDesignations } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteDesignationsParams {
  designationIds: string[];
}

export const useDeleteDesignations = () => {
  const deleteDesignationsMutation = useMutation<IApiResponse, Error, IDeleteDesignationsParams>({
    mutationFn: async ({ designationIds }) => deleteDesignations(designationIds),
  });
  return {
    deleteDesignationsMutation,
  };
};

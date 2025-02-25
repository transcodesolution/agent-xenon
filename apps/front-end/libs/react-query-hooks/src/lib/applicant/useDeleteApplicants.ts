
import { deleteApplicants } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteApplicantRequest {
  applicantIds: string[];
}

export const useDeleteApplicants = () => {
  const deleteApplicantsMutation = useMutation<IApiResponse, Error, IDeleteApplicantRequest>({
    mutationFn: async ({ applicantIds }) => deleteApplicants(applicantIds),
  });
  return {
    deleteApplicantsMutation,
  };
};

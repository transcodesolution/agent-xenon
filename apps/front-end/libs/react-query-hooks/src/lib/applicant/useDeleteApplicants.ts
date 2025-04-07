import { deleteApplicants } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useMutation } from '@tanstack/react-query';
import { IDeleteApplicantsRequest } from '@agent-xenon/types-api';

export const useDeleteApplicants = () => {
  const deleteApplicantsMutation = useMutation<IApiResponse, Error, IDeleteApplicantsRequest>({
    mutationFn: async ({ applicantIds, jobId }) =>
      deleteApplicants({
        applicantIds,
        ...(jobId?.trim() ? { jobId } : {}),
      }),
  });

  return {
    deleteApplicantsMutation,
  };
};

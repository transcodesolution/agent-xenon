import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IApplicant } from '@agent-xenon/interfaces';
import { createJobApplicantByAgent } from '@agent-xenon/web-apis'; // Assuming this is the correct API function
import { AxiosError } from 'axios';

export const useCreateJobApplicantByAgent = () => {
  return useMutation<IApiResponse<IApplicant>, AxiosError, { jobId: string }>({
    mutationKey: ['createJobApplicantByAgent'],
    mutationFn: (params) => {
      return createJobApplicantByAgent(params);
    },
  });
};
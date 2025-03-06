import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { updateApplicantStatus } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { IUpdateApplicantStatusRequest } from '@/libs/types-api/src';

export const useUpdateApplicantStatus = () => {
  return useMutation<IApiResponse, AxiosError, IUpdateApplicantStatusRequest>({
    mutationKey: ['updateApplicantStatus'],
    mutationFn: (params) => {
      return updateApplicantStatus(params);
    },
  });
};

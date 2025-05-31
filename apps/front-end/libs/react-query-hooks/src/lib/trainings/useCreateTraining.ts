import { useMutation } from '@tanstack/react-query';
import { IApiResponse, ITraining } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createTraining } from '@agent-xenon/web-apis';

export const useCreateTraining = () => {
  return useMutation<IApiResponse<ITraining>, AxiosError, Partial<ITraining>>({
    mutationKey: ['useCreateTraining'],
    mutationFn: (params) => {
      return createTraining(params);
    },
  });
};

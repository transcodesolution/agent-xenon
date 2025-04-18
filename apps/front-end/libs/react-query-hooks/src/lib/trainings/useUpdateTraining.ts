import { useMutation } from '@tanstack/react-query';
import { IApiResponse, ITraining } from '@agent-xenon/interfaces';
import { updateTraining } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateTraining = () => {
  return useMutation<IApiResponse<ITraining>, AxiosError, Partial<ITraining>>({
    mutationKey: ['useUpdateTraining'],
    mutationFn: (params) => {
      return updateTraining(params);
    },
  });
};

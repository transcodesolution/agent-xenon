import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IDesignation } from '@agent-xenon/interfaces';
import { updateDesignation } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

export const useUpdateDesignation = () => {
  return useMutation<IApiResponse<IDesignation>, AxiosError, Partial<IDesignation>>({
    mutationKey: ['useUpdateDesignation'],
    mutationFn: (params) => {
      return updateDesignation(params);
    },
  });
};

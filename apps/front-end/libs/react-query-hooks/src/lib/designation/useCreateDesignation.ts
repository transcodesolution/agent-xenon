import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IDesignation } from '@agent-xenon/interfaces';
import { AxiosError } from 'axios';
import { createDesignation } from '@agent-xenon/web-apis';

export const useCreateDesignation = () => {
  return useMutation<IApiResponse<IDesignation>, AxiosError, Partial<IDesignation>>({
    mutationKey: ['useCreateDesignation'],
    mutationFn: (params) => {
      return createDesignation(params);
    },
  });
};

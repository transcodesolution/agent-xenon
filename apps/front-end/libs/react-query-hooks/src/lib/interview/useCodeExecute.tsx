import { useMutation } from '@tanstack/react-query';
import { IApiResponse } from '@agent-xenon/interfaces';
import { codeExecute } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';
import { ICodeExecuteRequest, ICodeExecuteResponse } from '@agent-xenon/types-api';

export const useCodeExecute = () => {
  return useMutation<IApiResponse<ICodeExecuteResponse>, AxiosError, ICodeExecuteRequest>({
    mutationKey: ['codeExecute'],
    mutationFn: (params) => {
      return codeExecute(params);
    },
  });
};
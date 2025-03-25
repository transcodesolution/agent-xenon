import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRound } from '@agent-xenon/interfaces';
import { interviewRoundStart } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

interface IUseInterviewRoundStart {
  jobId: string
  roundId: string
};
export const useInterviewRoundStart = () => {
  return useMutation<IApiResponse<IInterviewRound>, AxiosError, Partial<IUseInterviewRoundStart>>({
    mutationKey: ['interviewRoundStart'],
    mutationFn: (params) => {
      return interviewRoundStart(params as IUseInterviewRoundStart);
    },
  })
}

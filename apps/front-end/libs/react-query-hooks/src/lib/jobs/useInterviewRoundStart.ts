import { useMutation } from '@tanstack/react-query';
import { IApiResponse, IInterviewRounds } from '@agent-xenon/interfaces';
import { interviewRoundStart } from '@agent-xenon/web-apis';
import { AxiosError } from 'axios';

interface IUseInterviewRoundStart {
  jobId: string
  roundId: string
};
export const useInterviewRoundStart = () => {
  return useMutation<IApiResponse<IInterviewRounds>, AxiosError, Partial<IUseInterviewRoundStart>>({
    mutationKey: ['interviewRoundStart'],
    mutationFn: (params) => {
      return interviewRoundStart(params as IUseInterviewRoundStart);
    },
  })
}

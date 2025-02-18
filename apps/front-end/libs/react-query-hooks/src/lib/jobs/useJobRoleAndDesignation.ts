import { getJobRoleAndDesignation } from '@/libs/web-apis/src';
import { IApiResponse, IGetJobRoleAndDesignation } from '@agent-xenon/interfaces';
import { useQuery } from '@tanstack/react-query';


export const useJobRoleAndDesignation = () => {
  return useQuery<IApiResponse<IGetJobRoleAndDesignation>>({
    queryKey: ['getJobRoleAndDesignation'],
    queryFn: async () => getJobRoleAndDesignation(),
    refetchOnWindowFocus: false,
  });
};

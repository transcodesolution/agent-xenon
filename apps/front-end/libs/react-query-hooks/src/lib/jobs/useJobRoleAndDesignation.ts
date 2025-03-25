import { IGetJobRoleAndDesignation } from '@agent-xenon/types-api';
import { getJobRoleAndDesignation } from '@agent-xenon/web-apis';
import { IApiResponse } from '@agent-xenon/interfaces';
import { useQuery } from '@tanstack/react-query';


export const useJobRoleAndDesignation = () => {
  return useQuery<IApiResponse<IGetJobRoleAndDesignation>>({
    queryKey: ['getJobRoleAndDesignation'],
    queryFn: async () => getJobRoleAndDesignation(),
    refetchOnWindowFocus: false,
  });
};

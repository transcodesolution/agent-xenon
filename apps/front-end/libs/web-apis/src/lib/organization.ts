import { IApiResponse, IOrganization } from '@agent-xenon/interfaces';
import http from './http-common'

export const updateOrganization = async (params: Partial<IOrganization>): Promise<IApiResponse> => {
  try {
    const result = await http.put<IApiResponse>(`/organization`, params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while updating organization: ${error}`);
  }
};
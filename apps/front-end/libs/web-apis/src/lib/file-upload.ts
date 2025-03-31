import { AxiosProgressEvent } from 'axios';
import http, { BASE_API_URL } from './http-common'
import { IApiResponse } from '@agent-xenon/interfaces';


export const uploadFileToServiceViaHandler = async ({
  formData,
  onUploadProgress,
}: {
  formData: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<IApiResponse<{ files: string[] }>> => {
  const url = `${BASE_API_URL}/document/upload`;

  const result = await http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return result.data;
};
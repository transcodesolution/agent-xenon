import { AxiosProgressEvent } from 'axios';
import http from './http-common'
import { IApiResponse } from '@agent-xenon/interfaces';


export const uploadFileToServiceViaHandler = async ({
  formData,
  onUploadProgress,
}: {
  formData: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<IApiResponse<{ files: string[] }>> => {
  const url = 'http://localhost:7000/document/upload';

  const result = await http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return result.data;
};
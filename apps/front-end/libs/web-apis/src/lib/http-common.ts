import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError as OriginalAxiosError } from 'axios';

type AxiosError = { config: { _retry: boolean } } & OriginalAxiosError;

export const BASE_API_URL = 'http://localhost:7000';

export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2E5Nzc2ZDA5NmQzNzM4ZmI1MzQxN2YiLCJ0eXBlIjoiYWRtaW5pc3RyYXRvciIsIm9yZ2FuaXphdGlvbklkIjoiNjdhOTc3NmQwOTZkMzczOGZiNTM0MTdjIiwic3RhdHVzIjoiTG9naW4iLCJnZW5lcmF0ZWRPbiI6MTczOTE1OTgwNzc4NywiaWF0IjoxNzM5MTU5ODA3fQ.e2rIpsZ33gVtWRzmH5dZQuoU-5SOFkgPvTK1Ou-VKrM';

export const setupAxiosInterceptors = () => {

  axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (request.headers) {
        request.headers['Authorization'] = `${token}`;
        console.log('Token set in header:', request.headers['Authorization']); // Debugging
      }
      return request;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError as OriginalAxiosError } from 'axios';

type AxiosError = { config: { _retry: boolean } } & OriginalAxiosError;

export const BASE_API_URL = 'http://localhost:7000';
export const NEXT_APP_URL = 'http://localhost:3000';

//this instance created to talk with back-end
const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

//this instance is created to talk with next server
export const axiosNextServerInstance = axios.create({
  baseURL: NEXT_APP_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const setupAxiosInterceptors = (token: string, navigateToLogin?: (url: string) => void) => {
  axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (request.headers) {
        request.headers['Authorization'] = `${token}`;
      }
      return request;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          const currentUrl = new URL(window.location.href);
          const tokenParam = currentUrl.searchParams.get('token');

          let redirectUrl = '/signin';
          if (tokenParam) {
            redirectUrl += `?token=${tokenParam}`;
          }
          if (navigateToLogin) {
            navigateToLogin(redirectUrl);
          } else {
            window.location.href = redirectUrl;
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
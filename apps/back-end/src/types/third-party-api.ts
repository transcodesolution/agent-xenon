export type HttpMethodType = "get" | "post" | "patch" | "put" | "delete";

export interface IHttpRequestParam {
    queryParams?: Record<string, string>;
    requestBody?: object;
    axiosConfig?: object;
}

export interface IConnectAppResponse {
    redirectUrl: string;
    isConnectGoogleApp?: boolean;
}
export interface IApiResponse<T = object> {
    status: number
    message: string
    data?: T
    error?: { message?: string, stack?: string }
}

export type PaginationApiResponseType<T, U = IPaginationApiResponseState> = {
    state: U
    totalData: number,
} & { [key: string]: T }

export interface IPaginationApiResponseState {
    page: number;
    limit: number;
    page_limit: number;
};
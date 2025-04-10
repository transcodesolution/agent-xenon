export interface IApiResponse<T = object> {
    status: number
    message: string
    data?: T
    error?: { message?: string, stack?: string }
}

export type PaginationApiResponseType<T, U = PaginationApiResponseState> = {
    state: U
    totalData: number,
} & { [key: string]: T }

export type PaginationApiResponseState = {
    page: number;
    limit: number;
    page_limit: number;
};
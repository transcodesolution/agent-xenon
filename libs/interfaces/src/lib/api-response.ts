export interface IApiResponse<T> {
    status: number
    message: string
    data?: T
    error?: { message?: string, stack?: string }
}

export type PaginationApiResponseType<T> = {
    state: { page: number, limit: number, page_limit: number }
    totalData: number,
} & { [key: string]: T }
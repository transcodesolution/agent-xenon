export interface IApiResponse<T> {
    status: number
    message: string
    data?: T
    error?: { message?: string, stack?: string }
}
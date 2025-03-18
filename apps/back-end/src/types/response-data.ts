export type ResponseDataType = Array<object | string> | object | null | undefined;

export type FileDataType = { originalname: string, buffer: Buffer, mimetype: string, location?: string };

export interface IExecuteCodeResponse {
    run: {
        stdout: string;
        stderr: string;
        code: string;
        signal: string;
        output: string;
    }
}
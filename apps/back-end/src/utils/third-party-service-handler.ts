import axios from "axios";
import { HttpMethodType, IHttpRequestParam } from "../types/third-party-api";

const apiRequestHandler = async (httpMethod: HttpMethodType, url: string, { queryParams = {}, requestBody = {}, ...axiosConfig }: IHttpRequestParam = {}) => {
    try {
        const response = await axios[httpMethod](url + '?' + new URLSearchParams(queryParams).toString(), httpMethod === 'get' ? {} : requestBody, {
            timeout: 60000,
            ...axiosConfig
        });

        return { data: response.data, status: response.status };
    } catch (error) {
        throw {
            error: error.response ? error.response.data : error.message,
            status: error.response ? error.response.status : 500
        };
    }
};

export default apiRequestHandler;
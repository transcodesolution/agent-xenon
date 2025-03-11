import axios from "axios";

export const apiErrorHandler = (error: unknown, action: string): never => {
  if (axios.isAxiosError(error)) {
    throw new Error(`Error while ${action}: ${error.response?.data?.message || error.message}`);
  } else {
    throw new Error(`An unexpected error occurred while ${action}.`);
  }
};

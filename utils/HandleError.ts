import type ApiResponse from "~/types/ApiResponse";
import { ErrorApiResponse } from "~/types/const/ErrorApiResponse";

// * Handle the return when api callings are failed
export const HandleError = (error: any) => {
    if (error.response) {
        return error.response._data as ApiResponse;
    }
    return ErrorApiResponse;
};

import type ApiResponse from "../ApiResponse";

export const ErrorApiResponse: ApiResponse = {
    code: 500,
    message: "Có lỗi, vui lòng thử lại sau",
    result: null,
};

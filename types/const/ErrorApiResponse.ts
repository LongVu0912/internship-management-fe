import type ApiResponse from "../ApiResponse";

export const ErrorApiResponse = (error: any): ApiResponse => {
    let code = 500;
    let message = "Có lỗi, vui lòng thử lại sau";
    
    if (error.response?.status === 401) {
        code = 401;
        message = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
    }

    return {
        code,
        message,
        result: null,
    };
};

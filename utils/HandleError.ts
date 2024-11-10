import type ApiResponse from "~/types/ApiResponse";

// * Handle the return when API callings are failed
export const HandleError = (error: any): ApiResponse => {
    let code = 500;
    let message = "Có lỗi, vui lòng thử lại sau";

    if (error.response) {
        if (error.response.status === 401) {
            code = 401;
            message = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
        } 
        else if (error.response.status === 404) {
            code = 404;
            message = "Không tìm thấy";
        }
        else {
            return error.response._data as ApiResponse;
        }
    }

    return {
        code,
        message,
        result: null,
    };
};
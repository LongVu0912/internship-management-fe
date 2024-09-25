import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import { PageConfig } from "~/types/student/PageConfig";

export const AdminRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    // * Get the student profile using jwt token in header
    const getAllStudentPaging = async (payload: PageConfig): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/student/GetAllStudentPaging`,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
                    
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getAllStudentPaging,
    };
};

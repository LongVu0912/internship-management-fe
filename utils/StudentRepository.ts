import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import { ErrorApiResponse } from "~/types/enums/ErrorApiResponse";

export const StudentRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    // * Get the student profile using jwt token in header
    const getStudentProfile = async (): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(`/student/MyProfile`);

            return response;
        } catch (error: any) {
            if (error.response) {
                return error.response._data as ApiResponse;
            }
            return ErrorApiResponse;
        }
    };

    return {
        getStudentProfile,
    };
};

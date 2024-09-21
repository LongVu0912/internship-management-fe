import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";

export const StudentRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    // * Get the student profile using jwt token in header
    const getStudentProfile = async (): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(`/student/MyProfile`);

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getStudentProfile,
    };
};

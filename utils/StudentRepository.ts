import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Student from "~/types/student/Student";

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

    // * Get the student profile by id
    const getStudentProfileById = async (payload: {
        studentId: string;
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/student/${payload.studentId}`,
                {
                    method: "POST",
                }
            );

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const uploadCV = async (payload: { cv: File }) => {
        const formData = new FormData();
        formData.append("cv", payload.cv);

        try {
            const response: ApiResponse = await fetch(`/student/UploadCV`, {
                method: "POST",
                body: formData,
            });

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const updateProfile = async (payload: Student) => {
        try {
            const response: ApiResponse = await fetch(
                `/student/UpdateStudent`,
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
        getStudentProfile,
        getStudentProfileById,
        uploadCV,
        updateProfile,
    };
};

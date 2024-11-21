import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type { PageConfig } from "~/types/page_config/PageConfig";
import type RecruitmentRequest from "~/types/recruitment/RecruitmentRequest";
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

    const getStudentPaging = async (
        payload: PageConfig
    ): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/student/GetStudentPaging`,
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

    const importStudents = async (payload: { file: File }) => {
        const formData = new FormData();
        formData.append("file", payload.file);

        try {
            const response: ApiResponse = await fetch(
                `/student/ImportStudents`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getAllStudentInstructorsRequestPaging = async (
        payload: PageConfig
    ) => {
        try {
            const response: ApiResponse = await fetch(
                `/student/GetAllStudentInstructorsRequestPaging`,
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

    const getAllStudentRecruitmentsRequestPaging = async (
        payload: PageConfig
    ) => {
        try {
            const response: ApiResponse = await fetch(
                `/student/GetAllStudentRecruitmentsRequestPaging`,
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

    const requestInstructor = async (payload: RecruitmentRequest) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/RequestInstructor`,
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

    const createStudent = async (payload: Student) => {
        try {
            const response: ApiResponse = await fetch(
                `/student/CreateStudent`,
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

    const getAllStudentWithSeekingIntern = async (
        payload: PageConfig
    ): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/student/GetAllStudentWithSeekingIntern`,
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

    const deleteRecruitmentRequests = async (payload: {
        recruitmentRequestIds: string[];
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/student/DeleteRecruitmentRequests`,
                {
                    method: "POST",
                    body: payload.recruitmentRequestIds,
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const deleteInstructorRequests = async (payload: {
        instructorRequestIds: string[];
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/student/DeleteInstructorRequests`,
                {
                    method: "POST",
                    body: payload.instructorRequestIds,
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
        getStudentPaging,
        uploadCV,
        updateProfile,
        importStudents,
        getAllStudentInstructorsRequestPaging,
        getAllStudentRecruitmentsRequestPaging,
        requestInstructor,
        createStudent,
        getAllStudentWithSeekingIntern,
        deleteRecruitmentRequests,
        deleteInstructorRequests
    };
};

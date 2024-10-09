import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Business from "~/types/business/Business";
import { PageConfig } from "~/types/PageConfig";

export const AdminRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    // * Get the student profile using jwt token in header
    const getAllStudentPaging = async (
        payload: PageConfig
    ): Promise<ApiResponse> => {
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

    const getAllFaculties = async (): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/faculty/GetAllFaculties`,
                {
                    method: "GET",
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getMajorsByFacultyId = async (payload: {
        facultyId: string;
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/major/GetMajorsByFacultyId/${payload.facultyId}`,
                {
                    method: "GET",
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const createBusiness = async (payload: Business): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/business/CreateBusiness`,
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
        getAllFaculties,
        getMajorsByFacultyId,
        createBusiness,
    };
};

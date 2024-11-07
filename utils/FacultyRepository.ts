import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Business from "~/types/business/Business";
import { PageConfig } from "~/types/page_config/PageConfig";

export const FacultyRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const getFacultyPaging = async (payload: PageConfig) => {
        try {
            const response: ApiResponse = await fetch(
                `/faculty/GetFacultyPaging`,
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

    return {
        getFacultyPaging,
        getMajorsByFacultyId
    };
};

import type Major from "./../types/major/Major";
import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Faculty from "~/types/faculty/Faculty";
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

    const saveFaculty = async (payload: Faculty): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(`/faculty/SaveFaculty`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const saveMajor = async (payload: Major): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(`/major/SaveMajor`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getFacultyPaging,
        getMajorsByFacultyId,
        saveFaculty,
        saveMajor,
    };
};

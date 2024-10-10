import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import { PageConfig } from "~/types/page/PageConfig";

export const RecruitmentRepository = <T>(
    fetch: $Fetch<T, NitroFetchRequest>
) => {
    const getRecruitmentPaging = async (payload: PageConfig) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/GetRecruitmentPaging`,
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

    const getRecruitmentById = async (payload: { recruitmentId: string }) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/GetRecruitmentById?recruitmentId=${payload.recruitmentId}`,
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
        getRecruitmentPaging,
        getRecruitmentById,
    };
};

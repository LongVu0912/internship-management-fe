import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import { PageConfig } from "~/types/page/PageConfig";
import type Recruitment from "~/types/recruitment/Recruitment";
import type RecruitmentRequest from "~/types/recruitment/RecruitmentRequest";

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

    const createRecruitment = async (payload: Recruitment) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/CreateRecruitment`,
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

    const requestRecruitment = async (payload: RecruitmentRequest) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/RequestRecruitment`,
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
        getRecruitmentPaging,
        createRecruitment,
        getRecruitmentById,
        requestRecruitment,
    };
};

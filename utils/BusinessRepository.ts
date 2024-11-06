import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type { PageConfig } from "~/types/page_config/PageConfig";
export const BusinessRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const getBusinessData = async (payload: { businessId?: string }) => {
        try {
            const response: ApiResponse = await fetch(
                `/business/GetBusinessData`,
                {
                    method: "GET",
                    params: {
                        businessId: payload.businessId ?? "",
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getMyBusinessData = async () => {
        try {
            const response: ApiResponse = await fetch(
                `/business/GetMyBusinessData`,
                {
                    method: "GET",
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getBusinessPaging = async (payload: PageConfig) => {
        try {
            const response: ApiResponse = await fetch(
                `/business/GetBusinessPaging`,
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
        getBusinessData,
        getMyBusinessData,
        getBusinessPaging,
    };
};

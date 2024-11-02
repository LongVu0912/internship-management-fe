import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
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

    return {
        getBusinessData,
        getMyBusinessData,
    };
};

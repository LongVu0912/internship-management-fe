import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
export const BusinessRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const getBusinessById = async (payload: { businessId: string }) => {
        try {
            const response: ApiResponse = await fetch(
                `/business/BusinessProfile/${payload.businessId}`,
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
        getBusinessById,
    };
};

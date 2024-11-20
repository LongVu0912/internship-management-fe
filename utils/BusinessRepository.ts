import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Business from "~/types/business/Business";
import type GradePoint from "~/types/business/GradePoint";
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

    const updateProfile = async (payload: Business): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/business/UpdateProfile`,
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

    const uploadImage = async (payload: { image: File }) => {
        const formData = new FormData();
        formData.append("imageFile", payload.image);

        try {
            const response: ApiResponse = await fetch(`/avatar/UploadImage`, {
                method: "POST",
                body: formData,
            });

            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const gradePoint = async (payload: GradePoint): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(`/business/GradePoint`, {
                method: "POST",
                body: JSON.stringify(payload),
            });
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getBusinessData,
        getMyBusinessData,
        getBusinessPaging,
        createBusiness,
        updateProfile,
        uploadImage,
        gradePoint,
    };
};

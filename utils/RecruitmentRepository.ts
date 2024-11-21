import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Status from "~/types/enums/Status";
import { PageConfig } from "~/types/page_config/PageConfig";
import type Recruitment from "~/types/recruitment/Recruitment";
import type RecruitmentRequest from "~/types/recruitment/RecruitmentRequest";

export const RecruitmentRepository = <T>(
    fetch: $Fetch<T, NitroFetchRequest>
) => {
    const getOpenRecruitmentPaging = async (payload: PageConfig) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/GetOpenRecruitmentPaging`,
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

    const getAllBusinessRecruitmentPaging = async (payload: {
        pageConfig: PageConfig;
        businessId?: string;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/GetAllBusinessRecruitmentPaging`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.pageConfig),
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

    const getAllRecruitmentRequestOfRecruitmentPaging = async (payload: {
        pageConfig: PageConfig;
        recruitmentId?: string;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/GetAllRecruitmentRequestOfRecruitmentPaging`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.pageConfig),
                    params: {
                        recruitmentId: payload.recruitmentId ?? "",
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const setRecruitmentRequestStatus = async (payload: {
        recruitmentRequestId: string;
        status: Status;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/business/SetRecruitmentRequestStatus`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.status),
                    params: {
                        recruitmentRequestId: payload.recruitmentRequestId,
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const updateRecruitment = async (payload: {
        recruitment: Recruitment;
        businessId?: string;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/UpdateRecruitment`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.recruitment),
                    params: {
                        businessId: payload.businessId || "",
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const inviteStudent = async (payload: {
        recruitmentId: string;
        studentId: string;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/recruitment/InviteStudent`,
                {
                    method: "POST",
                    params: {
                        recruitmentId: payload.recruitmentId || "",
                        studentId: payload.studentId || "",
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getOpenRecruitmentPaging,
        createRecruitment,
        getRecruitmentById,
        requestRecruitment,
        getAllBusinessRecruitmentPaging,
        getAllRecruitmentRequestOfRecruitmentPaging,
        setRecruitmentRequestStatus,
        updateRecruitment,
        inviteStudent,
    };
};

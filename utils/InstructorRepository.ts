import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type InstructorStatus from "~/types/enums/InstructorStatus";
import type Instructor from "~/types/instructor/Instructor";
import type { PageConfig } from "~/types/page_config/PageConfig";

export const InstructorRepository = <T>(
    fetch: $Fetch<T, NitroFetchRequest>
) => {
    const getInstructorPaging = async (payload: PageConfig) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/GetInstructorPaging`,
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

    const getAllInstructorRequestOfInstructorPaging = async (payload: {
        pageConfig: PageConfig;
        instructorId?: string;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/GetAllInstructorRequestOfInstructorPaging`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.pageConfig),
                    params: {
                        instructorId: payload.instructorId ?? "",
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const setRequestStatus = async (payload: {
        instructorRequestId: string;
        status: InstructorStatus;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/SetRequestStatus`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.status),
                    params: {
                        instructorRequestId: payload.instructorRequestId,
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const createInstructor = async (payload: Instructor) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/CreateInstructor`,
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

    const getInstructorData = async (payload: { instructorId: string }) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/GetInstructorData`,
                {
                    method: "GET",
                    params: {
                        instructorId: payload.instructorId,
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getMyInstructorData = async () => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/GetMyInstructorData`,
                {
                    method: "GET",
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const updateInstructor = async (payload: Instructor): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/UpdateInstructor`,
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
        getInstructorPaging,
        getAllInstructorRequestOfInstructorPaging,
        setRequestStatus,
        createInstructor,
        getInstructorData,
        getMyInstructorData,
        updateInstructor,
    };
};

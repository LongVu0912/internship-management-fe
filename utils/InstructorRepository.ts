import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type Status from "~/types/enums/Status";
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
        instructorRequestIds: string[];
        status: Status;
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/SetRequestStatus`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.instructorRequestIds),
                    params: {
                        requestStatus: payload.status,
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const completeRequest = async (payload: {
        instructorRequestIds: string[];
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/CompleteRequest`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.instructorRequestIds),
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

    const updateInstructor = async (
        payload: Instructor
    ): Promise<ApiResponse> => {
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
        completeRequest,
        createInstructor,
        getInstructorData,
        getMyInstructorData,
        updateInstructor,
    };
};

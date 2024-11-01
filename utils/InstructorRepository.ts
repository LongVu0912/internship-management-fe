import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
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

    return {
        getInstructorPaging,
    };
};

import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";

export const InstructorRepository = <T>(
    fetch: $Fetch<T, NitroFetchRequest>
) => {
    const getAllInstructor = async () => {
        try {
            const response: ApiResponse = await fetch(
                `/instructor/GetAllInstructor`,
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
        getAllInstructor,
    };
};

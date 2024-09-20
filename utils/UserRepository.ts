import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";

export const UserRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const changePassword = async (payload: {
        oldPassword: string;
        newPassword: string;
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/profile/ChangePassword`,
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
        changePassword,
    };
};

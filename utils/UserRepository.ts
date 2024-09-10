import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";

export const UserRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    return {
        login: (payload: { username: string; password: string }) => {
            if (payload.password === "1") {
                return {
                    code: 200,
                    message: "Success",
                    result: {
                        username: "User",
                    },
                } as ApiResponse;
            }

            return {
                code: 401,
                message: "Unauthorized",
                result: null,
            } as ApiResponse;

            // TODO: Implement the actual API call
        },
    };
};

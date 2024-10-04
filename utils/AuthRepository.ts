import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";

export const AuthRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const token = useCookie("token");

    // * login with username and password
    const login = async (payload: {
        username: string;
        password: string;
    }): Promise<ApiResponse> => {
        try {
            const response: ApiResponse = await fetch(
                `/authentication/Authenticate`,
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

    // * remove token from cookie
    const logout = (): void => {
        token.value = null;
        navigateTo("/login");
    };

    return {
        login,
        logout,
    };
};

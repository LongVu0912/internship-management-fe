import type { NitroFetchRequest, $Fetch } from "nitropack";
import { jwtDecode } from "jwt-decode";
import type JwtPayload from "~/types/JwtPayload";
import type ApiResponse from "~/types/ApiResponse";

export const JwtRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const tokenCookie = useCookie("token");

    // * Check if the user is logged
    const isLogged = async () => {
        if (tokenCookie.value && await isTokenValid(tokenCookie.value)) {
            return true;
        }
        return false;
    };

    // * Decode the jwt token
    const decodeToken = (token: string): JwtPayload => {
        return jwtDecode(token);
    };

    // * Save the token to cookie
    const saveTokenToCookie = (token: string) => {
        tokenCookie.value = token;
    };

    // * Check if the token is valid with backend
    const isTokenValid = async (token: string): Promise<boolean> => {
        try {
            // * Check if the token is valid with backend
            const response: ApiResponse = await fetch(
                `/authentication/IntroSpect`,
                {
                    method: "POST",
                    body: JSON.stringify({ token }),
                }
            );

            // ? true or false
            return response.result;
        } catch (error) {
            return false;
        }
    };

    return {
        decodeToken,
        saveTokenToCookie,
        isTokenValid,
        isLogged,
    };
};

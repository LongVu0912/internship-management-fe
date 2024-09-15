import type { NitroFetchRequest, $Fetch } from "nitropack";
import { jwtDecode } from "jwt-decode";
import type JwtPayload from "~/types/JwtPayload";

export const JwtRepository = () => {
    const tokenCookie = useCookie("token");

    const isLogged = () => {
        if (tokenCookie.value && isTokenValid(tokenCookie.value)) {
            return true;
        }
        return false;
    };

    const decodeToken = (token: string): JwtPayload => {
        return jwtDecode(token);
    };

    const getUserDecodedToken = (): JwtPayload => {
        return decodeToken(tokenCookie.value || "");
    };

    const saveToken = (token: string) => {
        tokenCookie.value = token;
    };

    const isTokenValid = (token: string): boolean => {
        try {
            const decodedToken = decodeToken(token);
            const currentTime = Date.now() / 1000;

            // TODO: Check if the token is valid with backend

            return decodedToken.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    return {
        decodeToken,
        saveToken,
        isTokenValid,
        isLogged,
        getUserDecodedToken,
    };
};

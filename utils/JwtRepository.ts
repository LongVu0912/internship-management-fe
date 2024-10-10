import type { NitroFetchRequest, $Fetch } from "nitropack";
import { jwtDecode } from "jwt-decode";
import type JwtPayload from "~/types/JwtPayload";
import type ApiResponse from "~/types/ApiResponse";
import Role from "~/types/enums/Role";

export const JwtRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const tokenCookie = useCookie("token", {
        secure: true,
        maxAge: 60 * 60 * 24,
    });

    // * Check if the user is logged
    const isLogged = async () => {
        if (tokenCookie.value) {
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

    // * Get role from the token
    const getRole = async () => {
        if (tokenCookie.value) {
            const decodedToken = decodeToken(tokenCookie.value);
            const scope = decodedToken.scope as string;

            // Find the role with the "ROLE_" prefix
            const role = scope
                .split(" ")
                .find((permission) => permission.startsWith("ROLE_"));

            return role ? (role as Role) : Role.ROLE_GUEST;
        }
        return Role.ROLE_GUEST;
    };

    // * Get profile name from sub
    const getProfileName = async () => {
        try {
            if (await isLogged()) {
                return decodeToken(tokenCookie.value || "").sub;
            }
            return "No login";
        } catch {
            return "Error";
        }
    };

    return {
        decodeToken,
        saveTokenToCookie,
        isLogged,
        getRole,
        getProfileName,
    };
};

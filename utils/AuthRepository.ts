import { jwtDecode } from "jwt-decode";
import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import type JwtPayload from "~/types/JwtPayload";
import { UserState } from "~/types/UserState";
import Role from "~/types/enums/Role";

export const AuthRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const tokenCookie = useCookie("token", {
        secure: true,
        maxAge: 60 * 60 * 24,
    });

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
        tokenCookie.value = null;
        useUserState().value.isLogged = false;
        navigateTo("/login");
    };

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
                return decodeToken(tokenCookie.value ?? "").sub;
            }
            return "No login";
        } catch {
            return "Error";
        }
    };

    // * Get user state for global use
    const getUserState = async (): Promise<UserState> => {
        let userState = new UserState();

        // * Check login
        if (tokenCookie.value) {
            userState.isLogged = true;
        }

        // * If login, get information
        if (userState.isLogged) {
            userState.username = await getProfileName();
            userState.role = await getRole();
        }

        return userState;
    };

    return {
        login,
        logout,
        getUserState,
        saveTokenToCookie,
        getProfileName,
    };
};

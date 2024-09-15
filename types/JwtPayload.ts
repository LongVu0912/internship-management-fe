import type Role from "./enums/Role";

export default interface JwtPayload {
    exp: number;
    iat: number;
    jti: string;
    scope: Role;
    sub: string;
}

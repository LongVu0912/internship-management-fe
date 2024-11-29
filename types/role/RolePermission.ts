import type Role from "./Role";
import type Permission from "./Permission";

export default interface RolePermission {
    id: string;
    role: Role;
    permission: Permission;
    dateCreated: Date;
}

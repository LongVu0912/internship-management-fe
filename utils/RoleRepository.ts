import type { NitroFetchRequest, $Fetch } from "nitropack";
import type ApiResponse from "~/types/ApiResponse";
import { PageConfig } from "~/types/page_config/PageConfig";

export const RoleRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
    const getRolePermissionPaging = async (payload: PageConfig) => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/GetRolePermissionPaging`,
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

    const getAllRole = async () => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/GetAllRole`,
                {
                    method: "GET",
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getAllPermission = async () => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/GetAllPermission`,
                {
                    method: "GET",
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const createPermission = async (payload: { name: string }) => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/CreatePermission`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.name),
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const getPermissionByRoleId = async (payload: { roleId: string }) => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/GetPermissionByRoleId`,
                {
                    method: "GET",
                    params: {
                        roleId: payload.roleId,
                    },
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    const bindRolePermission = async (payload: {
        roleIds: string[];
        permissionIds: number[];
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/BindRolePermission`,
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

    const deleteRolePermission = async (payload: {
        rolePermissionIds: string[];
    }) => {
        try {
            const response: ApiResponse = await fetch(
                `/rolepermission/DeleteRolePermission`,
                {
                    method: "POST",
                    body: JSON.stringify(payload.rolePermissionIds),
                }
            );
            return response;
        } catch (error: any) {
            return HandleError(error);
        }
    };

    return {
        getRolePermissionPaging,
        getAllRole,
        getAllPermission,
        createPermission,
        getPermissionByRoleId,
        bindRolePermission,
        deleteRolePermission
    };
};

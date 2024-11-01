import Role from "~/types/enums/Role";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;

    if (useUserState().value.role != Role.ROLE_INSTRUCTOR) {
        return navigateTo("/login");
    }
});

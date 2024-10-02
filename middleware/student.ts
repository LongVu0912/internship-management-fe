import Role from "~/types/enums/Role";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const { $api } = useNuxtApp();

    const jwtRepository = JwtRepository($api);
    const role = await jwtRepository.getRole();

    if (role != Role.ROLE_STUDENT) {
        return navigateTo("/login");
    }
});

import Role from "~/types/enums/Role";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;

    // return;

    const { $api } = useNuxtApp();

    const jwtRepository = JwtRepository($api);
    const authRepository = AuthRepository($api);
    const role = await jwtRepository.getRole();

    if (role != Role.ADMIN) {
        return navigateTo("/");
    }
});

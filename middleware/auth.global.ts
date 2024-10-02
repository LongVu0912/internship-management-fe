export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const { $api } = useNuxtApp();

    const jwtRepository = JwtRepository($api);

    if ((await jwtRepository.isLogged()) && to.path === "/login") {
        return navigateTo("/");
    }
});

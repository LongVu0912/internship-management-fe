export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const { $api } = useNuxtApp();

    const jwtRepository = JwtRepository($api);
    const isLogged = await jwtRepository.isLogged();

    if (!isLogged) {
        return navigateTo("/login");
    }
});

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $api } = useNuxtApp();
    const jwtRepository = JwtRepository($api);

    if (await jwtRepository.isLogged() && to.path === "/login") {
        return navigateTo("/");
    }
});

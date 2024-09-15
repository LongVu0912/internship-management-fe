export default defineNuxtRouteMiddleware(async (to, from) => {
    const jwtRepository = JwtRepository();

    if (jwtRepository.isLogged() && to.path === "/login") {
        return navigateTo("/");
    }
});

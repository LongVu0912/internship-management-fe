export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;

    if (useUserState().value.isLogged && to.path === "/login") {
        return navigateTo("/");
    }
});

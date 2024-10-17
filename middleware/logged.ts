export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    
    if (!useUserState().value.isLogged) {
        return navigateTo("/login");
    }
});

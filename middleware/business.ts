import Role from "~/types/enums/Role";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;

    // const { $api } = useNuxtApp();
    // const authRepository = AuthRepository($api);

    // useUserState().value = await authRepository.getUserState();

    if (useUserState().value.role != Role.ROLE_BUSINESS) {
        return navigateTo("/login");
    }
});

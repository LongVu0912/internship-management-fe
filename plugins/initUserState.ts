export default defineNuxtPlugin(async (nuxtApp) => {
    const { $api } = useNuxtApp();
    const authRepository = AuthRepository($api);
    const userState = useUserState();

    userState.value = await authRepository.getUserState();
    console.log("Initiation User State: ", userState.value);
});

export default defineNuxtPlugin(async (nuxtApp) => {
    const token = useCookie("token");
    const { $api } = useNuxtApp();
    const authRepository = AuthRepository($api);

    const apiToken = $fetch.create({
        baseURL:
            window.localStorage.getItem("backendUrl") ??
            useRuntimeConfig().public.backendUrl,
        async onRequest({ request, options, error }) {
            if (useUserState().value.isLogged) {
                const headers: any = options.headers;
                if (Array.isArray(headers)) {
                    headers.push(["Authorization", `Bearer ${token.value}`]);
                } else if (headers instanceof Headers) {
                    headers.set("Authorization", `Bearer ${token.value}`);
                } else {
                    headers.Authorization = `Bearer ${token.value}`;
                }
            }
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                await nuxtApp.runWithContext(() => {
                    authRepository.logout();
                });
            }
        },
    });

    return {
        provide: {
            apiToken,
        },
    };
});

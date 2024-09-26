export default defineNuxtPlugin(async (nuxtApp) => {
    const token = useCookie("token");
    const { $api } = useNuxtApp();
    const jwtRepository = JwtRepository($api);
    const authRepository = AuthRepository($api);

    const apiToken = $fetch.create({
        baseURL: window.localStorage.getItem('backendUrl') || useRuntimeConfig().public.backendUrl,
        async onRequest({ request, options, error }) {
            if (token.value && (await jwtRepository.isLogged())) {
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
                    navigateTo("/login");
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

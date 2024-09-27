export default defineNuxtPlugin(async (nuxtApp) => {
    const api = $fetch.create({
        baseURL:
            window.localStorage.getItem("backendUrl") ||
            useRuntimeConfig().public.backendUrl,
    });

    return {
        provide: {
            api,
        },
    };
});

export default defineNuxtPlugin(async (nuxtApp) => {
    const api = $fetch.create({
        baseURL: useRuntimeConfig().public.backendUrl,
    });

    return {
        provide: {
            api,
        },
    };
});

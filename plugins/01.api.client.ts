export default defineNuxtPlugin(async (nuxtApp) => {
    const api = $fetch.create({
        baseURL: window.localStorage.getItem('backendUrl') || 'http://localhost:8080/api',
    });

    return {
        provide: {
            api,
        },
    };
});

export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: "2024-09-10",
    ssr: true,
    css: ["~/assets/css/main.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],
    runtimeConfig: {
        public: {
            backendUrl: process.env.BACKEND_URL || "http://localhost:8080",
        },
    },
    modules: ["@nuxt/ui", "@nuxt/icon", "@nuxtjs/color-mode", "@vueuse/nuxt"],
});

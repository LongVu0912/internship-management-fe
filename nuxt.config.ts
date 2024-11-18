export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: "2024-09-10",
    ssr: false,
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
            backendUrl: process.env.BACKEND_URL ?? "http://localhost:8080/api",
        },
    },
    modules: [
        "@nuxt/ui",
        "@nuxt/icon",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "@nuxt/image",
    ],
    image: {
        quality: 80,
    },
    app: {
        head: {
            title: "HCMUTE INTERNSHIP",
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: "/favicon.ico",
                },
            ],
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    charset: "utf-8",
                },
                {
                    name: "description",
                    content: "HCMUTE Internship - Tìm kiếm thực tập HCMUTE",
                },
                {
                    property: "og:image",
                    content: "/hcmute.png",
                },
                {
                    property: "og:title",
                    content: "Tìm kiếm thực tập HCMUTE",
                },
                {
                    property: "og:description",
                    content: "HCMUTE Internship - Tìm kiếm thực tập HCMUTE",
                },
                {
                    property: "og:type",
                    content: "website",
                },
            ],
        },
    },
});

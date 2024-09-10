/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "background-login": "url('/background.jpg')",
            },
            colors: {
                blue: {
                    50: "#F0F6FA",
                    100: "#E6F1F7",
                    200: "#BED7E8",
                    300: "#9CBEDB",
                    400: "#618BC2",
                    500: "#2e56a6",
                    600: "#264996",
                    700: "#1A367D",
                    800: "#112763",
                    900: "#0A194A",
                    950: "#040E30",
                },
            },
        },
    },
};

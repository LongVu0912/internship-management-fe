export default defineAppConfig({
    ui: {
        primary: "blue",
        gray: "slate",
        select: {
            base: "font-semibold",
            placeholder: "text-gray-900 dark:text-gray-50",
            icon: {
                base: "text-gray-900 dark:text-gray-50",
            },
        },
        button: {
            default: {
                loadingIcon: "mingcute:loading-fill",
            },
        },
        input: {
            placeholder: "placeholder-gray-900 dark:placeholder-gray-50",
            base: "font-semibold",
            icon: {
                base: "text-gray-600 dark:text-gray-50",
            },
        },
    },
});

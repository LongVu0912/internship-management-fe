export default defineAppConfig({
    ui: {
        primary: "blue",
        gray: "slate",
        select: {
            base: "font-medium",
            icon: {
                base: "",
            },
        },
        button: {
            default: {
                color: "gray",
                loadingIcon: "mingcute:loading-fill",
            },
            icon: {
                base: "",
            },
        },
        input: {
            base: "font-medium disabled:cursor-text disabled:select-text",
            icon: {
                base: "",
            },
            default: {
                size: "md",
                color: "gray",
            },
        },
        textarea: {
            base: "font-medium",
        },
    },
});

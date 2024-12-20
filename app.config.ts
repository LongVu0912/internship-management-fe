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
            base: "font-medium",
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
        card: {
            body: {
                padding: "p-4 sm:py-2 sm:px-6",
            },
        },
        chip: {
            translate: {
                "top-right": "-translate-y-1/4 translate-x-1/4 transform",
            },
        },
        table: {
            td: {
                base: "",
            },
            default: {
                loadingState: {
                    icon: "mingcute:loading-fill",
                    label: "Đang tải",
                },
                emptyState: {
                    label: "Không tìm thấy",
                },
            },
        },
    },
});

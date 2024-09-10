interface ToastOptions {
    title: string;
    description: string;
    timeout?: number;
    type?: "success" | "error" | "info";
    onCallback?: () => void | null;
}

export default defineNuxtPlugin((nuxtApp) => {
    const toast = useToast();

    const showToast = ({
        title = "Notification",
        description,
        timeout = 2000,
        type = "info",
        onCallback,
    }: ToastOptions): void => {
        var toastIcon = "heroicons:information-circle";
        var toastColor = "primary";

        switch (type) {
            case "success":
                toastIcon = "i-heroicons-check-circle";
                toastColor = "green";
                break;
            case "error":
                toastIcon = "heroicons:x-circle";
                toastColor = "red";
                break;
            case "info":
                toastIcon = "heroicons:information-circle";
                toastColor = "primary";
                break;
        }

        toast.add({
            title: title,
            description: description,
            icon: toastIcon,
            color: toastColor as any,
            timeout: timeout,
            callback: onCallback,
        });
    };

    return {
        provide: {
            showToast,
        },
    };
});

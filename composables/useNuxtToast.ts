interface ToastOptions {
    title?: string;
    description: string;
    timeout?: number;
    type?: "success" | "error" | "info";
    onCallback?: () => void | null;
}

export const useNuxtToast = () => {
    const toast = useToast();
    const { t } = useI18n();

    const showToast = ({
        title = t('notification'),
        description,
        timeout = 2000,
        type = "info",
        onCallback,
    }: ToastOptions): void => {
        var toastIcon = "heroicons:information-circle";
        var toastColor = "primary";

        switch (type) {
            case "success":
                toastIcon = "mingcute:check-circle-line";
                toastColor = "green";
                break;
            case "error":
                toastIcon = "mingcute:close-circle-line";
                toastColor = "red";
                break;
            case "info":
                toastIcon = "mingcute:information-line";
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

    return showToast;
};

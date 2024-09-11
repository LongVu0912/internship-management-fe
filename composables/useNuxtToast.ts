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

    return showToast;
};

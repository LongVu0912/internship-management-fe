interface ToastOptions {
    title?: string;
    description: string;
    timeout?: number;
    type?: "success" | "error" | "info";
    onCallback?: () => void | null;
}

export const useNuxtToast = () => {
    const toast = useToast();

    const showToast = ({
        title = "Thông báo",
        description = "Chưa làm xong",
        timeout = 2000,
        type = "info",
        onCallback,
    }: ToastOptions): void => {
        let toastIcon = "heroicons:information-circle";
        let toastColor = "primary";

        switch (type) {
            case "success":
                toastIcon = "mingcute:check-circle-line";
                toastColor = "green";
                break;
            case "error":
                toastIcon = "mingcute:close-circle-line";
                toastColor = "red";
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

import Status from "~/types/enums/Status";

export const AppUtils = () => {
    const convertStatus = (status: string) => {
        if (status == Status.PENDING) return "Đang duyệt";
        if (status == Status.REJECT) return "Từ chối";
        if (status == Status.APPROVED) return "Đồng ý";
        if (status == Status.COMPLETED) return "Hoàn thành";
        return status;
    };

    const statusBadge = (status: string) => {
        if (status == Status.PENDING) return "gray";
        if (status == Status.REJECT) return "red";
        if (status == Status.APPROVED) return "teal";
        if (status == Status.COMPLETED) return "green";
        return "primary";
    };

    const convertDateToString = (date: Date | string): string => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const subLongText = (text: string, maxLength: number = 10): string => {
        if (text === null || text === undefined) {
            return "";
        }

        if (text.length <= maxLength) {
            return text;
        }

        return text.substring(0, maxLength) + "...";
    };

    return {
        convertStatus,
        statusBadge,
        convertDateToString,
        subLongText,
    };
};

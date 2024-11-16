export const AppUtils = () => {
    const convertStatus = (status: String) => {
        if (status == "PENDING") return "Đang duyệt";
        if (status == "REJECT") return "Từ chối";
        if (status == "APPROVED") return "Được duyệt";
        if (status == "COMPLETED") return "Hoàn thành";
        return status;
    };

    const statusBadge = (status: String) => {
        if (status == "PENDING") return "gray";
        if (status == "REJECT") return "red";
        if (status == "APPROVED") return "green";
        if (status == "COMPLETED") return "teal";
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

    const subLongText = (text: string, maxLength: number = 20): string => {
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
        subLongText
    };
};

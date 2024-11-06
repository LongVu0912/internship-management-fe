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

    return {
        convertStatus,
        statusBadge,
    };
};

export const useSidebarState = () => {
    return useState<boolean>("sidebarState", () => false);
};

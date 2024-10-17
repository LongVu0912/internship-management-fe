import { UserState } from "~/types/UserState";

export const useSidebarState = () => {
    return useState<boolean>("sidebarState", () => false);
};

export const useUserState = () => {
    return useState<UserState>("userState", () => new UserState());
};
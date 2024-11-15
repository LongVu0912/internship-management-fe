import Role from "./enums/Role";

class UserState {
    isLogged: boolean;
    username: string;
    role: Role;
    quantityOfNotifications: number;

    constructor() {
        this.isLogged = false;
        this.username = "";
        this.role = Role.ROLE_GUEST;
        this.quantityOfNotifications = 0;
    }
}

export { UserState };

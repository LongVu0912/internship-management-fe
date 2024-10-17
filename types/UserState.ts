import Role from "./enums/Role";

class UserState {
    isLogged: boolean;
    username: string;
    role: Role;

    constructor() {
        this.isLogged = false;
        this.username = "";
        this.role = Role.ROLE_GUEST;
    }
}

export { UserState };

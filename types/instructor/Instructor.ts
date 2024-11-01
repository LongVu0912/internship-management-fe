import type Faculty from "../faculty/Faculty";
import type Profile from "../profile/Profile";

export default interface Instructor {
    faculty: Faculty;
    profile: Profile;
    instructorId: string;
}

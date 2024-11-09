import type Faculty from "../faculty/Faculty";
import type Profile from "../profile/Profile";

export default interface Instructor {
    faculty: Faculty;
    facultyId?: string;
    profile: Profile;
    instructorId: string;
}

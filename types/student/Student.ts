import type Faculty from "../faculty/Faculty";
import type { Major } from "../major/Major";
import type Profile from "../profile/Profile";

export default interface Student {
    studentId: string;
    year: string;
    isSeekingIntern: boolean;
    dob: string;
    classId: null;
    profile: Profile;
    faculty: Faculty;
    major: Major;
}

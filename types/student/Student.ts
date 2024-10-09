import type { Major } from "../major/Major";
import type Profile from "../profile/Profile";

export default interface Student {
    studentId: string;
    year: number;
    isSeekingIntern: boolean;
    dob: string;
    classId: string;
    profile: Profile;
    major: Major;
}

import type Profile from "../profile/Profile";

export default interface Business {
    name: string;
    overview: string;
    location: string;
    type: string;
    industry: string;
    workingDay: string;
    workingHour: string;
    instructorId: string;
    managedBy: Profile;
}

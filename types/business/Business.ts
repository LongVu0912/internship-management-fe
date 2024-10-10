import type Profile from "../profile/Profile";

export default interface Business {
    businessId: string,
    name: string;
    overview: string;
    location: string;
    type: string;
    industry: string;
    workingDay: string;
    workingHour: string;
    instructorId: string;
    managedBy: Profile;
    profile: Profile;
}

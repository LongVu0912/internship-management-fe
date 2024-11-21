import type Profile from "../profile/Profile";
import type Recruitment from "../recruitment/Recruitment";

export default interface Business {
    businessId: string;
    name: string;
    overview: string;
    location: string;
    industry: string;
    workingDay: string;
    workingHour: string;
    instructorId: string;
    businessWebsite: string;
    businessImage: string;
    managedBy: Profile;
    recruitments?: Recruitment[];
}

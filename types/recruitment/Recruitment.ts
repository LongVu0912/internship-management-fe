import type Business from "../business/Business";

export default interface Recruitment {
    recruitmentId: string;
    title:         string;
    description:   string;
    location:      string;
    type:          string;
    workingDay:    string;
    workingHour:   string;
    keySkills:     string;
    position:      string;
    business:      Business;
    businessName:      string;
}

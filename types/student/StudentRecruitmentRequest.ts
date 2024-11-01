import type BusinessStatus from "../enums/BusinessStatus";
import type Recruitment from "../recruitment/Recruitment";

export default interface StudentRecruitmentRequest {
    businessStatus: BusinessStatus;
    messageToBusiness: string;
    recruitment: Recruitment;
}

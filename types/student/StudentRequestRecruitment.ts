import type BusinessStatus from "../enums/BusinessStatus";
import type Recruitment from "../recruitment/Recruitment";
import type Student from "./Student";

// * Request that student sent to business
export default interface StudentRequestRecruitment {
    recruitmentRequestId?: string;
    businessStatus?: BusinessStatus;
    messageToBusiness?: string;
    recruitment?: Recruitment;
    student?: Student;
}

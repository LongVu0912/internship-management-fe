import type Status from "../enums/Status";
import type Recruitment from "../recruitment/Recruitment";
import type Student from "./Student";

// * Request that student sent to business
export default interface StudentRequestRecruitment {
    recruitmentRequestId?: string;
    businessStatus?: Status;
    messageToBusiness?: string;
    recruitment?: Recruitment;
    student?: Student;
}

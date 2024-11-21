import type Status from "../enums/Status";
import type Instructor from "../instructor/Instructor";
import type Student from "./Student";

// * Request that student sent to instructor
export default interface StudentRequestInstructor {
    instructorRequestId?: string;
    student?: Student;
    instructor: Instructor;
    instructorStatus: Status;
    messageToInstructor: string;
    recruitmentId?: string;
    recruitmentTitle?: string;
    point?: number;
}

import type InstructorStatus from "../enums/InstructorStatus";
import type Instructor from "../instructor/Instructor";
import type Student from "./Student";

// * Request that student sent to instructor
export default interface StudentRequestInstructor {
    instructorRequestId?: string;
    student?: Student;
    instructor: Instructor;
    instructorStatus: InstructorStatus;
    messageToInstructor: string;
    recruitmentId?: string;
    recruitmentTitle?: string;
}

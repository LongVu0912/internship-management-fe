import type InstructorStatus from "../enums/InstructorStatus";
import type Instructor from "../instructor/Instructor";
import type Student from "../student/Student";

export default interface InstructorRequest {
    instructorRequestId?: string;
    student?: Student;
    instructor: Instructor;
    instructorStatus: InstructorStatus;
    messageToInstructor: string;
    recruitmentId?: string;
    recruitmentTitle?: string;
}

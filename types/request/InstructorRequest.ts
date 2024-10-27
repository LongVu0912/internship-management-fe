import type InstructorStatus from "../enums/InstructorStatus";
import type Instructor from "../instructor/Instructor";

export default interface InstructorRequest {
    instructor: Instructor;
    instructorStatus: InstructorStatus;
    messageToInstructor: string;
}

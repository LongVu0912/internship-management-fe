import type Faculty from "../faculty/Faculty";

export default interface Major {
    majorId: string;
    name: string;
    faculty: Faculty;
    facultyId?: string;
}

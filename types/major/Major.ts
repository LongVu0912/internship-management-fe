import type Faculty from "../faculty/Faculty";

export interface Major {
    majorId: string;
    name: string;
    faculty: Faculty
}

import type UploadContent from "../upload/UploadContent";

export default interface Profile {
    profileId: string;
    username: string;
    fullname: string;
    isMale: boolean;
    bio: string;
    phoneNumber: string;
    email: string;
    uploadContent: UploadContent
}

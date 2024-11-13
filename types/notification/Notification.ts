export default interface Notification {
    notificationId: string;
    title: string;
    content: string;
    read: boolean;
    dateCreated: Date;
}

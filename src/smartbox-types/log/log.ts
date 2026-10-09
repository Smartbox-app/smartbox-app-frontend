export type ILog = {
    date: Date;
    ownerId: string | null;
    ownerName: string | null;
    ownerEmail: string | null;
    message: string;
}

export type LogAction = 'sign_in';
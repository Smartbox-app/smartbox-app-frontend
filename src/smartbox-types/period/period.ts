export type PeriodEntity = {
    id: string;
    startAt: Date;
    finishAt: Date;
    rentFinishAt: Date;
    createdAt: Date;
    value: number;
    paid: boolean;
    invoiceId: string;
}
export interface FormType {
  durationInDays: number;
  discount: number;
  size: string;
  isFirstRent: boolean;
  dateStart: Date;
  dateEnd: Date;
  discountCode: string;
  card: {
    discount: number;
    durationInWeeks: number;
  };
}

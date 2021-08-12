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
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postCode: string;
  phone: string;
  mailToSendInvoice: string;
  isCompany?: boolean;
  companyName?: string;
  companyStreet?: string;
  companyCity?: string;
  companyPostCode?: string;
  nip?: string;
}

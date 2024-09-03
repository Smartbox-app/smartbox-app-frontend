export interface ExecutePaymentReq {
  paymentId: string;
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface ExecuteBlikPaymentReq {
  paymentId: string;
  code: string;
}
export interface NipReq {
  nip: string;
}

export interface CompanyData {
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  nip: string;
}

export interface BankRes {
  id: string;
  name: string;
  banks: string;
  img: string;
  main_bank_id: string;
}

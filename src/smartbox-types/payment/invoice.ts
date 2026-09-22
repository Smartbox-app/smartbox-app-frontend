// not full type, only necessary fields
export type FakturowniaInvoiceRes = {
    id: string;
    user_id: string;
    description: string;
    price_net: string;
    price_gross: string;
    create_at: string;
    updated_at: string;
    view_url: string;
  };
  
  export type FakturowniaInvoiceUserRes = {
    id: string;
    view_url: string;
  };
  
  export type InvoiceBuyerCommon = {
    buyer_country: string;
    buyer_post_code: string;
    buyer_city: string;
    buyer_email: string;
    buyer_street: string;
    buyer_company: boolean;
  };
  
  export type InvoiceCompanyBuyer = InvoiceBuyerCommon & {
    buyer_company: true;
    buyer_name: string;
    buyer_tax_no: string;
  };
  
  export type InvoicePrivateBuyer = InvoiceBuyerCommon & {
    buyer_company: false;
    buyer_first_name: string;
    buyer_last_name: string;
  };
  
  export type InvoiceBuyer = InvoiceCompanyBuyer | InvoicePrivateBuyer;
  
  export type InvoiceBuyerWithoutEmail =
    | Omit<InvoiceCompanyBuyer, 'buyer_email'>
    | Omit<InvoicePrivateBuyer, 'buyer_email'>;
  
  export type InvoicePosition = {
    name: string;
    tax: string;
    total_price_gross: string | number;
    quantity: number;
    quantity_unit: string;
  };
  
  export type InvoiceBodyBase = InvoiceBuyer & {
    kind: 'vat' | 'receipt';
    description: string;
    issue_date: string;
    sell_date: string;
    positions: InvoicePosition[];
    department_id?: string;
    exempt_tax_kind?: string;
  };
  
  export type InvoicePaidBody = InvoiceBodyBase & {
    status: 'paid';
  };
  
  export type InvoiceIssuedBody = InvoiceBodyBase & {
    status: 'issued';
    payment_to: string;
  };
  
  export type NewPaidInvoiceReq = {
    api_token: string;
    gov_save_and_send: boolean;
    invoice: InvoicePaidBody;
  };
  
  export type NewIssuedInvoiceReq = {
    api_token: string;
    gov_save_and_send: boolean;
    invoice: InvoiceIssuedBody;
  };
  
export type UpdateInvoiceReq = {
  api_token: string;
  invoice: Partial<
    InvoiceBodyBase & {
      status: 'paid' | 'issued';
    }
  >;
};

export type InvoiceConnector = {
  invoiceServiceApiKey: string;
  invoiceServiceDomain: string;
  invoiceServiceDepartmentID: string | null;
};
  
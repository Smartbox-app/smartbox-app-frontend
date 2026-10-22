export type TemplateVariableOption = {
  name: string;
  label: string;
};

export const AGREEMENT_TEMPLATE_VARIABLES: TemplateVariableOption[] = [
  { name: 'clientFirstName', label: 'application.templateVar.clientFirstName' },
  { name: 'clientLastName', label: 'application.templateVar.clientLastName' },
  { name: 'clientEmail', label: 'application.templateVar.clientEmail' },
  { name: 'clientPhone', label: 'application.templateVar.clientPhone' },
  { name: 'birthDate', label: 'application.templateVar.birthDate' },
  { name: 'isCompany', label: 'application.templateVar.isCompany' },
  { name: 'companyName', label: 'application.templateVar.companyName' },
  { name: 'nip', label: 'application.templateVar.nip' },
  { name: 'street', label: 'application.templateVar.street' },
  { name: 'city', label: 'application.templateVar.city' },
  { name: 'postCode', label: 'application.templateVar.postCode' },
  { name: 'companyStreet', label: 'application.templateVar.companyStreet' },
  { name: 'companyCity', label: 'application.templateVar.companyCity' },
  { name: 'companyPostCode', label: 'application.templateVar.companyPostCode' },
  { name: 'personalAddress', label: 'application.templateVar.personalAddress' },
  { name: 'companyAddress', label: 'application.templateVar.companyAddress' },
  {
    name: 'agreementAddress',
    label: 'application.templateVar.agreementAddress',
  },
  { name: 'boxSize', label: 'application.templateVar.boxSize' },
  { name: 'boxArea', label: 'application.templateVar.boxArea' },
  { name: 'boxNumber', label: 'application.templateVar.boxNumber' },
  { name: 'invoiceMail', label: 'application.templateVar.invoiceMail' },
  { name: 'stockName', label: 'application.templateVar.stockName' },
  { name: 'stockAddress', label: 'application.templateVar.stockAddress' },
  { name: 'cost', label: 'application.templateVar.cost' },
  { name: 'startAt', label: 'application.templateVar.startAt' },
  { name: 'finishAt', label: 'application.templateVar.finishAt' },
  { name: 'date', label: 'application.templateVar.date' },
];

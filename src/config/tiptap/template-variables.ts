export type TemplateVariableOption = {
  name: string;
  label: string;
};

export const AGREEMENT_TEMPLATE_VARIABLES: TemplateVariableOption[] = [
  { name: 'clientFirstName', label: 'Imię klienta' },
  { name: 'clientLastName', label: 'Nazwisko klienta' },
  { name: 'clientEmail', label: 'E-mail klienta' },
  { name: 'clientPhone', label: 'Telefon klienta' },
  { name: 'birthDate', label: 'Data urodzenia' },
  { name: 'isCompany', label: 'Czy firma (wartość logiczna)' },
  { name: 'companyName', label: 'Nazwa firmy' },
  { name: 'nip', label: 'NIP' },
  { name: 'street', label: 'Ulica' },
  { name: 'city', label: 'Miasto' },
  { name: 'postCode', label: 'Kod pocztowy' },
  { name: 'companyStreet', label: 'Ulica firmy' },
  { name: 'companyCity', label: 'Miasto firmy' },
  { name: 'companyPostCode', label: 'Kod pocztowy firmy' },
  { name: 'personalAddress', label: 'Adres osobisty' },
  { name: 'companyAddress', label: 'Adres firmy' },
  { name: 'agreementAddress', label: 'Adres na umowie' },
  { name: 'boxSize', label: 'Rozmiar boksu' },
  { name: 'boxArea', label: 'Powierzchnia boksu' },
  { name: 'boxNumber', label: 'Numer boksu' },
  { name: 'invoiceMail', label: 'E-mail do faktury' },
  { name: 'stockName', label: 'Nazwa lokalizacji' },
  { name: 'stockAddress', label: 'Adres lokalizacji' },
  { name: 'cost', label: 'Koszt' },
  { name: 'startAt', label: 'Data rozpoczęcia' },
  { name: 'finishAt', label: 'Data zakończenia' },
  { name: 'date', label: 'Data umowy' },
];

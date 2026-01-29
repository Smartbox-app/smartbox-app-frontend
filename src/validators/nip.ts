import { checkVAT, countries as vatCountries } from 'jsvat';
export const validateNip = (value: string, countryCode: string): boolean => {
  if (!value || !countryCode) return false;

  const matchingCountry = vatCountries.find((c) =>
    c.codes.includes(countryCode),
  );

  if (matchingCountry) {
    return checkVAT(value, [matchingCountry]).isValid;
  }

  switch (countryCode) {
    case 'UA':
      return value.length === 10;
  }

  if (!value) return false;

  return true;
};

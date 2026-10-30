import countries from 'i18n-iso-countries';

export const validateCountry = (value: string): boolean => {
  if (!value) return false;

  // Trimming
  const country = value.trim();

  return countries.isValid(country);
};

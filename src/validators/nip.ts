export const validateNip = (value: string): boolean => {
  if (!value) return false;

  // Trimming
  const nip = value.trim();

  // NIP must be exactly 10 digits
  if (!/^\d{10}$/.test(nip)) {
    return false;
  }

  // Official NIP checksum weights
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];

  const digits = nip.split('').map((d) => parseInt(d, 10));
  const checksum =
    weights.reduce((sum, weight, i) => sum + weight * digits[i], 0) % 11;

  return checksum === digits[9];
};

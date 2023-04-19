export const validateNip = (nip: string): boolean => {
  const nipWithoutDashes = nip.replace(/-/g, '');
  const reg = /^[0-9]{10}$/;
  if (!reg.test(nipWithoutDashes)) {
    return false;
  } else {
    const digits = ('' + nipWithoutDashes).split('');
    const checksum =
      (6 * Number(digits[0]) +
        5 * Number(digits[1]) +
        7 * Number(digits[2]) +
        2 * Number(digits[3]) +
        3 * Number(digits[4]) +
        4 * Number(digits[5]) +
        5 * Number(digits[6]) +
        6 * Number(digits[7]) +
        7 * Number(digits[8])) %
      11;
    return Number(digits[9]) === checksum;
  }
};

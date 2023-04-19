import { UserRes } from 'smartbox-types';

export const firstRentChecker = (u: UserRes): boolean => {
  return u.rentCount === 0 || u.rentCount === null;
};

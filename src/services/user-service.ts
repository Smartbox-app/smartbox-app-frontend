import { UserRole } from 'smartbox-types';

export default class UserService {
  static getSlugByRole = (role?: UserRole) => {
    switch (role) {
      case UserRole.admin:
        return 'admin';
      case UserRole.user:
        return 'user';
      case UserRole.worker:
        return 'worker';
      default:
        return null;
    }
  };
}

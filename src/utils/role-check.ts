import { UserRole } from 'smartbox-types';

export const isAdmin = (u: UserRole): boolean => u === UserRole.admin;
export const isUser = (u: UserRole): boolean => u === UserRole.user;
export const isWorker = (u: UserRole): boolean => u === UserRole.worker;

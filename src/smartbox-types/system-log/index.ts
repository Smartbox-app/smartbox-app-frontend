import { UserRole } from '../user/user-entity';

export type SystemLogMeta = {
  query?: unknown;
  params?: unknown;
  body?: unknown;
  error?: { name?: string; message?: string } | null;
};

export type SystemLogAdminListItem = {
  id: string;
  timestamp: Date;
  action: string;
  userId: string | null;
  userRole: UserRole | null;
  userEmail: string | null;
  userName: string | null;
  tenantId: string | null;
  method: string | null;
  path: string | null;
  statusCode: number | null;
  appErrorCode: number | null;
  durationMs: number | null;
  ip: string | null;
  meta: unknown | null;
};

export type SystemLogClientListItem = Pick<SystemLogAdminListItem, 'id' | 'timestamp' | 'action' | 'userEmail' | 'userId' | 'userRole' | 'userName' | 'appErrorCode' | 'ip' | 'meta'>;

export type SystemLogExportQuery = {
  start?: string;
  end?: string;
  userId?: string;
  action?: string;
  path?: string;
  tenantId?: string;
};


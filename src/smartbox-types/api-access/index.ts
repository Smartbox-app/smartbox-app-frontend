export enum PublicApiScope {
  BoxGroupsRead = 'box-groups:read',
  BoxGroupsReadBoxes = 'box-groups:read-boxes',
}

export const PUBLIC_API_SCOPES = Object.values(PublicApiScope);

export const isPublicApiScope = (value: string): value is PublicApiScope =>
  (PUBLIC_API_SCOPES as string[]).includes(value);

export type ApiAccessEntity = {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  tenantId: string;
  expiresAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiAccessTableRes = Pick<
  ApiAccessEntity,
  'id' | 'name' | 'tenantId' | 'isActive' | 'expiresAt' | 'createdAt'
> & {
  tenant?: string;
  identifier?: string;
  scopes: string;
};

export type ApiAccessRes = Pick<
  ApiAccessEntity,
  | 'id'
  | 'name'
  | 'tenantId'
  | 'scopes'
  | 'expiresAt'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
>;

export type CreateApiAccessRes = ApiAccessRes & {
  apiKey: string;
};

export type CreateApiAccessReq = {
  name: string;
  tenantId: string;
  scopes?: string[];
  expiresAt?: string;
};

export type UpdateApiAccessReq = {
  name?: string;
  scopes?: string[];
  expiresAt?: string | null;
  isActive?: boolean;
};

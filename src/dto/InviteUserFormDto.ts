import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { Language, UserRole } from 'smartbox-types';
import { errors } from 'src/validation/errors';

export class InviteUserFormDto {
  @IsArray({ message: errors.field_required })
  @ArrayMinSize(1, { message: errors.field_required })
  @IsEmail({}, { each: true, message: errors.incorrect_email })
  emails: string[];

  @IsEnum(UserRole, { message: errors.field_required })
  @IsNotEmpty({ message: errors.field_required })
  role: UserRole;

  @IsEnum(Language, { message: errors.field_required })
  @IsNotEmpty({ message: errors.field_required })
  lang: Language;

  @ValidateIf((o: InviteUserFormDto) => o.requireTenantId === true)
  @IsUUID('4', { message: errors.field_required })
  @IsNotEmpty({ message: errors.field_required })
  tenantId?: string;

  /** Set by the form; not sent to the API. */
  requireTenantId?: boolean;

  @ValidateIf((o: InviteUserFormDto) => o.role === UserRole.worker)
  @IsArray({ message: errors.field_required })
  @ArrayMinSize(1, { message: errors.field_required })
  stockIds: string[];
}

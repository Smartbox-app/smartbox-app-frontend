import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { PublicApiScope } from 'smartbox-types';
import { errors } from 'src/validation/errors';

export class CreateApiAccessFormDto {
  @IsString({ message: errors.field_required })
  @IsNotEmpty({ message: errors.field_required })
  name = '';

  @IsUUID('4', { message: errors.field_required })
  @IsNotEmpty({ message: errors.field_required })
  tenantId = '';

  @IsArray({ message: errors.field_required })
  @ArrayMinSize(1, { message: errors.field_required })
  @IsEnum(PublicApiScope, { each: true, message: errors.field_required })
  scopes: string[] = [];

  @IsOptional()
  @IsString()
  expiresAt = '';
}

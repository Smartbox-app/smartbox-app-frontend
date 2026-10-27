import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PublicApiScope } from 'smartbox-types';
import { errors } from 'src/validation/errors';

export class UpdateApiAccessFormDto {
  @IsString({ message: errors.field_required })
  @IsNotEmpty({ message: errors.field_required })
  name = '';

  @IsArray({ message: errors.field_required })
  @ArrayMinSize(1, { message: errors.field_required })
  @IsEnum(PublicApiScope, { each: true, message: errors.field_required })
  scopes: string[] = [];

  @IsOptional()
  expiresAt: Date | null = null;

  @IsBoolean()
  isActive = true;
}

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

import { errors } from 'src/validation/errors';

export class TenantSmtpConfigFormDto {
  @IsBoolean()
  useCustomSmtp!: boolean;

  @ValidateIf((o: TenantSmtpConfigFormDto) => o.useCustomSmtp)
  @IsNotEmpty({ message: errors.field_required })
  @IsString()
  @MaxLength(255)
  smtpHost!: string;

  @ValidateIf((o: TenantSmtpConfigFormDto) => o.useCustomSmtp)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  smtpPort!: number;

  @ValidateIf((o: TenantSmtpConfigFormDto) => o.useCustomSmtp)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  smtpUser?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  smtpPassword?: string;

  @IsBoolean()
  smtpSecure!: boolean;

  @IsBoolean()
  smtpIgnoreTls!: boolean;

  @IsOptional()
  @ValidateIf((o: TenantSmtpConfigFormDto) => (o.smtpFromEmail ?? '').trim() !== '')
  @IsEmail({}, { message: errors.incorrect_email })
  @MaxLength(255)
  smtpFromEmail?: string;
}

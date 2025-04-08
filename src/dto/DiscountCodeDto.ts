import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { __ } from 'src/helpers/i18n';
import { errors } from 'src/validation/errors';

export class DiscountCodeDto {
  @IsNotEmpty({
    message: errors.field_required
  })
  code: string;

  startDate: Date;
  endDate: Date;
}

import { IsNotEmpty } from 'class-validator';
import { RentDataDto } from './RentDataDto';
import { __ } from 'src/helpers/i18n';

export class RentDataDtoWithBirthdate extends RentDataDto {
  @IsNotEmpty({
    message: __('validation.field_required'),
  })
  birthdate: Date;
}

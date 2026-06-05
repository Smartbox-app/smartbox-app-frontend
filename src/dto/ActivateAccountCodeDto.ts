import { IsNotEmpty, IsString, Length } from 'class-validator';
import { errors } from 'src/validation/errors';

export class ActivateAccountCodeDto {
  @IsString()
  @IsNotEmpty({
    message: errors.field_required,
  })
  @Length(6, 6, { message: errors.incorrect_activation_code })
  code: string;
}

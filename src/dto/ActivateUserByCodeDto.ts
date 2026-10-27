import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

import { errors } from 'src/validation/errors';

export class ActivateUserByCodeDto {
  @IsString()
  @IsNotEmpty({
    message: errors.field_required,
  })
  @MaxLength(64)
  activationToken: string;

  @IsString()
  @IsNotEmpty({
    message: errors.field_required,
  })
  @Length(6, 6, { message: errors.incorrect_activation_code })
  code: string;
}

import { IsNotEmpty, MinLength } from 'class-validator';
import { errors } from 'src/validation/errors';
import { IsCustomEmail } from 'src/validators/IsCustomEmail';

export class LoginDto {
  @IsCustomEmail(
    {
      message: errors.incorrect_email,
    },
  )
  @IsNotEmpty({
    message: errors.field_required,
  })
  email: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  @MinLength(8, {
    message: errors.min_chars(8),
  })
  pwd: string;
}

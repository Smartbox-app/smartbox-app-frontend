import {
  Equals,
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { errors } from 'src/validation/errors';

export class RegisterDto {
  @IsEmail(
    {},
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
  firstName: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  lastName: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  @IsPhoneNumber('PL', { message: errors.incorrect_phone })
  phone: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  @MinLength(8, {
    message: errors.min_chars(8),
  })
  pwd: string;

  @ValidateIf((o) => o.pwd !== o.pwd2)
  @IsNotEmpty({
    message: errors.field_required,
  }) //<----- Here we validate that confirmPassword actually have a value
  @IsEmpty({ message: errors.passwords_must_match }) //<---- Message in case both password don't match
  pwd2: string;

  @IsBoolean()
  @Equals(true, { message: errors.check_required })
  rules: boolean;
}

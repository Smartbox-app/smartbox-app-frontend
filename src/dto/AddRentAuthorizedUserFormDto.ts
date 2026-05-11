import { IsEmail, IsIn, IsNotEmpty, Matches, ValidateIf } from 'class-validator';
import { errors } from 'src/validation/errors';

export class AddRentAuthorizedUserFormDto {
  @IsIn(['email', 'phone'])
  lookupMode: 'email' | 'phone';

  @IsNotEmpty({ message: 'application.rentAuthorizationsContactRequired' })
  @Matches(/\S/, { message: 'application.rentAuthorizationsContactRequired' })
  @ValidateIf((o: AddRentAuthorizedUserFormDto) => o.lookupMode === 'email')
  @IsEmail({}, { message: errors.incorrect_email })
  contact: string;
}

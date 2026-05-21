import { IsEmail, IsIn, IsNotEmpty, IsUUID, Matches, ValidateIf } from 'class-validator';
import { errors } from 'src/validation/errors';

export class StaffAddRentAuthorizationFormDto {
  @IsUUID('4', { message: 'application.rentAuthInvalidRentId' })
  rentId: string;

  @IsIn(['email', 'phone'])
  lookupMode: 'email' | 'phone';

  @IsNotEmpty({ message: 'application.rentAuthorizationsContactRequired' })
  @Matches(/\S/, { message: 'application.rentAuthorizationsContactRequired' })
  @ValidateIf((o: StaffAddRentAuthorizationFormDto) => o.lookupMode === 'email')
  @IsEmail({}, { message: errors.incorrect_email })
  contact: string;
}

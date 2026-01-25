import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { __ } from 'src/helpers/i18n';
import { errors } from 'src/validation/errors';
import { IsNip } from 'src/validators/IsCorrectNip';

export class RentDataDto {
  withBirthDate: boolean;

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
  city: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  street: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  postCode: string;

  @ValidateIf((d) => {
    return !!d.withBirthDate;
  })
  @IsNotEmpty({
    message: errors.field_required,
  })
  birthDate: Date;

  @IsNotEmpty({
    message: errors.field_required,
  })
  @IsEmail({}, { message: errors.incorrect_email })
  mailToSendInvoice: string;

  @IsNotEmpty({
    message: errors.field_required,
  })
  @IsPhoneNumber(undefined, { message: errors.incorrect_phone })
  phone: string;

  invoiceNeeded: boolean;

  @ValidateIf((d) => !!d.invoiceNeeded)
  @IsNotEmpty({
    message: errors.field_required,
  })
  companyName: string;

  @ValidateIf((d) => !!d.invoiceNeeded)
  @IsNotEmpty({
    message: errors.field_required,
  })
  companyStreet: string;

  @ValidateIf((d) => !!d.invoiceNeeded)
  @IsNotEmpty({
    message: errors.field_required,
  })
  companyCity: string;

  @ValidateIf((d) => !!d.invoiceNeeded)
  @IsPostalCode('PL', { message: errors.incorrect_postcode })
  @IsNotEmpty({
    message: errors.field_required,
  })
  companyPostCode: string;

  @ValidateIf((d) => !!d.invoiceNeeded)
  @IsNotEmpty({
    message: errors.field_required,
  })
  @IsNip({
    message: errors.incorrect_nip,
  })
  nip: string;

  @IsOptional()
  clientSource: string;
}

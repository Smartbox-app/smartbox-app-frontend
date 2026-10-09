import {
  IsBoolean,
  IsOptional,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { __ } from 'src/helpers/i18n';

@ValidatorConstraint({ name: 'atLeastOne', async: false })
export class AtLeastOneSelected implements ValidatorConstraintInterface {
  validate(_dval: unknown, args: ValidationArguments) {
    const dto = args.object as NotificationDto;

    return dto.email === true || dto.sms === true;
  }

  defaultMessage(_: ValidationArguments) {
    return __('application.at_least_one_option_required');
  }
}


export function IsAtleastOneSelected(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneSelected,
    });
  };
}


export class NotificationDto {
  @IsBoolean()
  email: boolean;

  @IsOptional()
  @IsBoolean()
  sms: boolean;

  @IsAtleastOneSelected()
  readonly atLeastOne!: boolean;
}

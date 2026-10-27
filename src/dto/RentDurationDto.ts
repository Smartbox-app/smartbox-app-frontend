import { IsNotEmpty } from 'class-validator';

import { errors } from 'src/validation/errors';

export class RentDurationDto {
  @IsNotEmpty({
    message: errors.field_required,
  })
  startDate: Date;

  @IsNotEmpty({
    message: errors.field_required,
  })
  endDate: Date;
}

import { IsNotEmpty } from 'class-validator';

import { errors } from 'src/validation/errors';

export class DeleteAccountDto {
  @IsNotEmpty({
    message: errors.field_required,
  })
  identifier: string;
}

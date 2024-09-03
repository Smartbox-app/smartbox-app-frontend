import { Prop } from '../store/prop.decorator';
import { BaseResponse } from '../base/baseRes';

export class BoxGroupAvailability extends BaseResponse {
  @Prop()
  size: number;
  @Prop()
  available: boolean;
}

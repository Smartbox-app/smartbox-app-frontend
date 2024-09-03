import { Store } from '../store/store';

export class BaseResponse {
  getProps = () =>
  Store.getProps(this);
}
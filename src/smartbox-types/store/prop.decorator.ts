import { Store } from './store';

export const Prop = (data?: any) => (target: any, propertyKey: string) => Store.registerProp(target, propertyKey, data);
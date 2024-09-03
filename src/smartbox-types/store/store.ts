interface Prop {
  name: string;
  select: boolean;
}

export class Store {
  private static propsMap: Map<any, string[]> = new Map();

  static registerProp(target: any, propertyKey: string, data?: any): void {
    let keys = this.propsMap.get(target);
    if (!keys) {
      keys = [];
      this.propsMap.set(target, keys);
    }
    keys.push( propertyKey );
  }

  static getProps(target: any) {
    return this.propsMap.get(Object.getPrototypeOf(target));
  }
}

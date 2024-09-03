import { AccessControl } from '../stock-group';
import { IBase } from '../base/base.interface';
import { IBoxGroup } from '../box/box-entity';

export interface IStock extends IBase{
  name: string;
  address: string;
  boxGroups: IBoxGroup[];
  gate: IGate;
  discount: IDiscount;
  map: string;
  visible: boolean;
  isMapActive: boolean;
  mapBackground: string;
  mapWidth: number;
  mapHeight: number;
  mapWidthMeters: number;
  mapHeightMeters: number;
  mapDefaultScale: number;
  tenantId: string;
  stockGroupId?: string;
  colorReserved: string;
  colorRented: string;
  colorNoPaidExtension: string;
  colorNoPaidExtensionWithWarning: string;
  colorToCheck: string;
  colorToExplain: string;
  colorOutOfService: string;
  colorFinished: string;
  colorFailure: string;
  colorFree: string;
  showGrossPricesToClient: boolean;
  accessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  allowedBoxesCount: number;
}

export interface IDiscount extends IBase {
  value: number;
  expireAt: Date;
}

export interface IGate extends IBase {
  ident: string;
  openReq: boolean;
  lastConnection: Date;
  tenantId: string;
  ksmIdentifier: string;
}

export interface Coordinate {
  lat: string;
  lon: string;
}

export interface IReading {
    date: Date;
    moduleId: string;
    moduleVoltage: number;
}
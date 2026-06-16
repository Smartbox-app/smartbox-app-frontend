import { createContext, useContext } from 'react';
import { BoxMapLayoutUpdate } from './utils/map-layout';

type BoxLayoutResetHandler = () => void;

export interface MapLayoutContextValue {
  onLayoutChange: (boxId: string, layout: BoxMapLayoutUpdate) => void;
  registerResetHandler: (boxId: string, handler: BoxLayoutResetHandler) => void;
  unregisterResetHandler: (boxId: string) => void;
}

const MapLayoutContext = createContext<MapLayoutContextValue | null>(null);

const useMapLayoutContext = () => useContext(MapLayoutContext);

export { MapLayoutContext, useMapLayoutContext };

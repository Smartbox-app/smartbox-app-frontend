import { BoxGroupType } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';

const ACCUSATIVE_KEYS: Record<BoxGroupType, string> = {
  [BoxGroupType.storage]: 'application.boxTypeAccusativeStorage',
  [BoxGroupType.parking]: 'application.boxTypeAccusativeParking',
  [BoxGroupType.locker]: 'application.boxTypeAccusativeLocker',
};

export const getBoxGroupTypeLabel = (type?: BoxGroupType) =>
  __(ACCUSATIVE_KEYS[type || BoxGroupType.storage]);

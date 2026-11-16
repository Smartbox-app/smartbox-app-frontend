import { BoxGroupType } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';

const ACCUSATIVE_KEYS: Record<BoxGroupType, string> = {
  [BoxGroupType.storage]: 'application.boxTypeAccusativeStorage',
  [BoxGroupType.parking]: 'application.boxTypeAccusativeParking',
  [BoxGroupType.locker]: 'application.boxTypeAccusativeLocker',
};

const PASSCODE_KEYS: Record<BoxGroupType, string> = {
  [BoxGroupType.storage]: 'application.passcodeBoxStorage',
  [BoxGroupType.parking]: 'application.passcodeBoxParking',
  [BoxGroupType.locker]: 'application.passcodeBoxLocker',
};

export const getBoxGroupTypeLabel = (type?: BoxGroupType) =>
  __(ACCUSATIVE_KEYS[type || BoxGroupType.storage]);

export const getBoxPasscodeLabel = (type?: BoxGroupType) =>
  __(PASSCODE_KEYS[type || BoxGroupType.storage]);

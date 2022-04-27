import React from 'react';
import { __ } from '../../../../../../helpers/i18n';

import './LockInfo.scss';

const LockInfo = () => (
  <div className="lock-info">
    <p className="lock-info-text">{__('application.dontForgetToBringLock')}</p>
    <img src="/assets/images/avatar/3.png" />
  </div>
);
export { LockInfo };

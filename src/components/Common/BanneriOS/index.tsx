import React, { useEffect, useState, useCallback } from 'react';
import { useTenant } from 'src/hooks/useTenant';
import { hasMobileAppIosLink } from 'src/utils/tenant-mobile-app-links';

import './BanneriOS.scss';
import { IOSShare } from 'src/icons';

const BannerIos = () => {
  const { tenant } = useTenant();
  const [isIos, setIsIos] = useState<boolean>();
  const [isComponentVisible, setComponentVisible] = useState<boolean>(false);

  // Detects if device is on iOS
  const isIosFn = useCallback(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }, []);
  // Detects if device is in standalone mode
  const isInStandaloneMode = useCallback(
    () =>
      'standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
    [],
  );

  useEffect(() => {
    // Checks if should display install popup notification:
    if (isIosFn() && !isInStandaloneMode()) {
      setIsIos(true);
    }
    const displayed = !!localStorage.getItem('banner-displayed');
    setComponentVisible(!displayed);
  }, []);

  const hide = () => {
    localStorage.setItem('banner-displayed', 'true');
    setComponentVisible(false);
  };

  if (hasMobileAppIosLink(tenant) || !isComponentVisible || !isIos) {
    return null;
  }

  return (
    <div className="banner-ios">
      <div className="banner-text">
        <div>
          <strong>Zainstaluj aplikację</strong>. Naciśnij{' '}
          <div className="banner-icon">
            <IOSShare />
          </div>{' '}
          i &quot;dodaj do ekranu początkowego&quot;
        </div>
        <button onClick={hide} className="banner-close">
          &times;
        </button>
      </div>
    </div>
  );
};
export default BannerIos;

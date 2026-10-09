import React, { useEffect, useState, useCallback } from 'react';
import { useTenant } from 'src/hooks/useTenant';
import { hasMobileAppAndroidLink } from 'src/utils/tenant-mobile-app-links';

import './BannerAndroid.scss';
import { Dots } from 'src/icons';

const BannerAndroid = () => {
  const { tenant } = useTenant();
  const [isAndroid, setIsAndroid] = useState<boolean>();
  const [isComponentVisible, setComponentVisible] = useState<boolean>(false);

  // Detects if device is on iOS
  const isAndroidFn = useCallback(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /android/.test(userAgent) && /chrome/i.test(userAgent);
  }, []);
  // Detects if device is in standalone mode
  const isInStandaloneMode = useCallback(
    () => window.matchMedia('(display-mode: standalone)').matches,
    [],
  );

  useEffect(() => {
    // Checks if should display install popup notification:
    if (isAndroidFn() && !isInStandaloneMode()) {
      setIsAndroid(true);
    }
    const displayed = !!localStorage.getItem('banner-displayed');
    setComponentVisible(!displayed);
  }, []);

  const hide = () => {
    localStorage.setItem('banner-displayed', 'true');
    setComponentVisible(false);
  };

  if (hasMobileAppAndroidLink(tenant) || !isComponentVisible || !isAndroid) {
    return null;
  }

  return (
    <div className="android-banner">
      <div className="banner-text">
        <div>
          <strong>Zainstaluj aplikację</strong>. Naciśnij
          <div className="banner-icon">
            <Dots />
          </div>{' '}
          i &quot;dodaj do ekranu głównego&quot;{' '}
        </div>
        <button onClick={hide} className="banner-close">
          &times;
        </button>
      </div>
    </div>
  );
};
export default BannerAndroid;

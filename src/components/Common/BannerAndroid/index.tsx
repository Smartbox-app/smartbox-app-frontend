import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '..';

import './BannerAndroid.scss';

const BannerAndroid = () => {
  const [isAndroid, setIsAndroid] = useState<boolean>();
  const [isComponentVisible, setComponentVisible] = useState<boolean>(false);

  // Detects if device is on iOS
  const isAndroidFn = useCallback(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /android/.test(userAgent) && /chrome/i.test(userAgent);
  }, []);
  // Detects if device is in standalone mode
  //@ts-ignore for ios
  const isInStandaloneMode = useCallback(() => window.matchMedia('(display-mode: standalone)').matches, []);

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

  return (
    <div className="android-banner">
      {isComponentVisible && (
        <>
          {isAndroid && (
            <div className="banner-text">
              <div>
                <strong>Zainstaluj aplikację</strong>. Naciśnij
                <div className="banner-icon">
                  <Icon icon="dots" noWrapper />
                </div>{' '}
                i "dodaj do ekranu głównego"{' '}
              </div>
              <button onClick={hide} className="banner-close">
                &times;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default BannerAndroid;

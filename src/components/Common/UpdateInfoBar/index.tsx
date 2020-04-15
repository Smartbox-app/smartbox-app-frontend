import React from 'react';
import { UpdateActivated, UpdateActivatedReload, UpdateAvailable } from 'react-workbox';

import './UpdateInfoBar.scss';

const onUpdateClick = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.waiting) {
    registration.waiting.postMessage('skipWaiting');
  }
  setTimeout(() => window.location.reload(true), 1000);
};

const UpdateInfoBar = () => (
  <>
    <UpdateAvailable>
      <div className="update-info-bar" onClick={onUpdateClick} role="button" tabIndex={0}>
        Rozwijamy się dla Ciebie, dodajemy nowe możliwości i poprawiamy błędy. Dostępna jest nowsza wersja aplikacji.
        Kliknij tutaj aby zaktualizować.
      </div>
    </UpdateAvailable>
    <UpdateActivated>
      <div className="update-info-bar" onClick={onUpdateClick} role="button" tabIndex={0}>
        Zaktualizowano aplikację. Kliknij tutaj aby użyć najnowszej wersji i skorzystać z wszystkich funkcji.
      </div>
    </UpdateActivated>
    <UpdateActivatedReload />
  </>
);

export default UpdateInfoBar;

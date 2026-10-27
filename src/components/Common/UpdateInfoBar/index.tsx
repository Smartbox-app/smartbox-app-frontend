import { UpdateActivated, UpdateActivatedReload, UpdateAvailable } from 'react-workbox';

import {__} from "src/helpers/i18n";

import 'src/components/Common/UpdateInfoBar/UpdateInfoBar.scss';

const onUpdateClick = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.waiting) {
    registration.waiting.postMessage('skipWaiting');
  }
  setTimeout(() => window.location.reload(), 1000);
};

const UpdateInfoBar = () => (
  <>
    <UpdateAvailable>
      <div className="update-info-bar" onClick={onUpdateClick} role="button" tabIndex={0}>
          {__('application.updateInfo')}
      </div>
    </UpdateAvailable>
    <UpdateActivated>
      <div className="update-info-bar" onClick={onUpdateClick} role="button" tabIndex={0}>
          {__('application.updateFinishedInfo')}
      </div>
    </UpdateActivated>
    <UpdateActivatedReload />
  </>
);

export default UpdateInfoBar;

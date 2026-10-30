import React, { useEffect, useState } from 'react';

import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Link, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  getCookieConsent,
  setCookieConsent,
} from 'src/utils/cookie-consent';

import 'src/components/Common/Modal/Modal.scss';

const Cookies = () => {
  const [undecided, setUndecided] = useState(() => getCookieConsent() === null);

  useEffect(() => {
    const sync = () => setUndecided(getCookieConsent() === null);
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!undecided) return null;

  return (
    <div
      className="modal visible"
      id="cookie-consent-modal"
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 1100 }}
    >
      <div className="modal-body">
        <Modal closable={false}>
          <Modal.Header title={__('application.cookieConsentTitle')} />
          <Modal.Content>
            <p>
              {__('application.privacyPoliceInfo')}{' '}
              <Link target="_blank" href="/privacy-policy" rel="noreferrer">
                <u>{__('application.privacyPolicy1')}</u>
              </Link>
              .
            </p>
          </Modal.Content>
          <Modal.Actions>
            <ButtonsContainer>
              <Button
                secondary
                text="application.cookieConsentReject"
                click={() => setCookieConsent('rejected')}
              />
              <Button
                primary
                text="application.cookieConsentAccept"
                click={() => setCookieConsent('accepted')}
              />
            </ButtonsContainer>
          </Modal.Actions>
        </Modal>
      </div>
    </div>
  );
};

export default Cookies;

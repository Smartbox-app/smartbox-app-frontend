import React, { useState } from 'react';
import './Cookies.scss';
import { __ } from '../../../helpers/i18n';

const Cookies = () => {
  const areAccepted = () => {
    try {
      return JSON.parse(localStorage.getItem('cookies') || 'false');
    } catch (e) {
      return false;
    }
  };

  const [accepted, setAccepted] = useState<boolean>(areAccepted());

  const accept = () => {
    localStorage.setItem('cookies', JSON.stringify(true));
    setAccepted(true);
  };

  return (
    <div className={`cookies-information ${accepted ? 'hide-cookies-bar' : ''}`}>
      <p>
        {__('application.privacyPoliceInfo')}{' '}
        <a target="_blank" href="/assets/2022_01_01_Polityka_Prywatnosci_SmartBox.pdf">
          <u>{__('application.privacyPolicy1')}</u>
        </a>
        .
      </p>
      <span className="exit" onClick={accept}>
        &times;
      </span>
    </div>
  );
};

export default Cookies;

import React from 'react';
import './Footer.scss';
import { __ } from '../../../helpers/i18n';

const Footer = () => (
  <footer>
    <a className="footerLink" target="_blank" href="/assets/2022_02_01_Regulamin_aplikacji_SmartBox.pdf">
      {__('application.statute')}
    </a>
    <a className="footerLink" target="_blank" href="/assets/2022_01_01_Polityka_Prywatnosci_SmartBox.pdf">
      {__('application.privacyPolicy')}
    </a>
    <p>&copy; SmartBox Sp. J.</p>
  </footer>
);

export default Footer;

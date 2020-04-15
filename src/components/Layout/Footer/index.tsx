import React from 'react';

import './Footer.scss';

const Footer = () => (
  <footer>
    <p>
      &copy; IDEA PV Sp.z.o.o. Wykonanie
      <a target="_blank" rel="noopener noreferrer" href="https://itdotfocus.com/pl/o-nas">
        <img className="menu-footer_logo" src="/assets/logo_IT_focus.png" alt="IT.focus" />
      </a>
    </p>
  </footer>
);

export default Footer;

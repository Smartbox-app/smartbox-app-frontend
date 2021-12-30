import React from 'react';
import './Footer.scss';
import {__} from "../../../helpers/i18n";

const Footer = () => (
    <footer>
        <a className='footerLink' target="_blank"
           href="/assets/20210422_Regulamin_aplikacji_SmartBox.pdf">
            Regulamin
        </a>
        <a className='footerLink' target="_blank"
           href="/assets/20210422_Polityka_Prywatnosci_SmartBox.pdf">
            Polityka Prywatności
        </a>
        <p>&copy; SmartBox Sp.z.o.o.</p>
    </footer>
);

export default Footer;

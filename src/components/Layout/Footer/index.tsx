import React from 'react';
import './Footer.scss';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';

const StyledFooter = styled.footer`
background: ${props => props.theme.colors.primary};
`

const Footer = () => {
    const tenant = useSelector((state: ApplicationState) => state.tenant);
    return <StyledFooter>
        {/* <a
            className="footerLink"
            target="_blank"
            rel="noreferrer noopener"
            href="https://smartbox-storage.pl/jak-to-dziala/"
        >
            {__('application.how_it_works')}
        </a>
        <a className="footerLink" target="_blank" href="/assets/2022_02_01_Regulamin_aplikacji_SmartBox.pdf">
            {__('application.statute')}
        </a>
        <a className="footerLink" target="_blank" href="/assets/2022_01_01_Polityka_Prywatnosci_SmartBox.pdf">
            {__('application.privacyPolicy')}
        </a> */}

        {/* <p>&copy; SmartBox Sp. J.</p> */}
        <p>&copy; { tenant?.name }</p>
    </StyledFooter>
}

export default Footer;

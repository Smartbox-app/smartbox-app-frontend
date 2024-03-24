import React from 'react';
import './Footer.scss';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import ApiService from '../../../services/api-service';

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
        </a>*/}
        {tenant?.rules && <a className="footerLink" target="_blank" href={`${ApiService.url}tenant/rules/${tenant.id}`}>
            {__('application.statute')}
        </a>
        }
        {
            tenant?.privacy && <a className="footerLink" target="_blank" href={`${ApiService.url}tenant/privacy/${tenant.id}`}>
                {__('application.privacyPolicy')}
            </a>
        }

        {/* <p>&copy; SmartBox Sp. J.</p> */}
        <p>&copy; {tenant?.name}</p>
    </StyledFooter >
}

export default Footer;

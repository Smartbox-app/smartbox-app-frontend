import { lighten } from 'polished';
import { createGlobalStyle } from 'styled-components';
import ApiService from './services/api-service';

interface GlobalStyleProps {
    tenantId: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
@font-face {
    font-family: 'smartbox';
    src: url(${ApiService.url}tenant/fonts/light?tenantId=${props => props.tenantId});
    font-weight: 300;
    font-style: normal;
    font-display: auto;
}
@font-face {
    font-family: 'smartbox';
    src: url(${ApiService.url}tenant/fonts/normal?tenantId=${props => props.tenantId});
    font-weight: 400;
    font-style: normal;
    font-display: auto;
}
@font-face {
    font-family: 'smartbox';
    src: url(${ApiService.url}tenant/fonts/bold?tenantId=${props => props.tenantId});
    font-weight: 700;
    font-style: normal;
    font-display: auto;
}

h3 {
    color: ${props => props.theme.colors.primary}
}

h4 {
    color: ${props => props.theme.colors.primary}
}

a {
    &:link {
        color: ${props => props.theme.colors.primary}
    }

    &:hover {
        color: ${props => lighten(0.1, props.theme.colors.primary)}
    }
}
`

export default GlobalStyle
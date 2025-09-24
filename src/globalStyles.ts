import { lighten } from 'polished';
import { createGlobalStyle } from 'styled-components';
import ApiService from './services/api-service';
import { colorOrDark } from './utils/color';
import { TenantForUsers } from 'smartbox-types';

interface GlobalStyleProps {
  tenant?: TenantForUsers | null;
}

interface GlobalFontProps {
  tenantId: string;
}

export const GlobalFont = createGlobalStyle<GlobalFontProps>`
  @font-face {
    font-family: 'smartbox';
    src: url(${ApiService.url}tenant/fonts/light/?tenantId=${(props) => props.tenantId});
    font-weight: 300;
    font-style: normal;
    font-display: fallback;
  }
  @font-face {
    font-family: 'smartbox';
    src: url(${ApiService.url}tenant/fonts/normal/?tenantId=${(props) => props.tenantId});
    font-weight: 400;
    font-style: normal;
    font-display: auto;
    font-display: fallback;
  }
  @font-face {
    font-family: 'smartbox';
    src: url(${ApiService.url}tenant/fonts/bold/?tenantId=${(props) => props.tenantId});
    font-weight: 700;
    font-style: normal;
    font-display: auto;
    font-display: fallback;
  }
`;

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
html {
    font-size: 14px;
  font-family: ${({ tenant }) => (tenant?.fontNormal ? 'smartbox, Inter, Tahoma, sans-serif' : 'Inter, Tahoma, sans-serif')};
    @media(min-width: 768px) {
        font-size: 16px;
    }
}

* {
  font-family: ${({ tenant }) => (tenant?.fontNormal ? 'smartbox, Inter, Tahoma, sans-serif' : 'Inter, Tahoma, sans-serif')};
}
    p {
    line-height: 1.5;
    }
h3 {
    color: ${(props) => colorOrDark(props.theme.colors.primary)}
}

h4 {
    color: ${(props) => colorOrDark(props.theme.colors.primary)}
}

a {
    &:link {
        color: ${(props) => colorOrDark(props.theme.colors.primary)}
    }

    &:hover {
        color: ${(props) => lighten(0.1, colorOrDark(props.theme.colors.primary))}
    }
}
`;

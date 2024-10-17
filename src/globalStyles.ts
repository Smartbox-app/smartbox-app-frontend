import { lighten } from 'polished';
import { createGlobalStyle } from 'styled-components';
import ApiService from './services/api-service';
import { colorOrDark } from './utils/color';

interface GlobalStyleProps {
    tenantId: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
h3 {
    color: ${props => colorOrDark(props.theme.colors.primary)}
}

h4 {
    color: ${props => colorOrDark(props.theme.colors.primary)}
}

a {
    &:link {
        color: ${props => colorOrDark(props.theme.colors.primary)}
    }

    &:hover {
        color: ${props => lighten(0.1, colorOrDark(props.theme.colors.primary))}
    }
}
`

export default GlobalStyle
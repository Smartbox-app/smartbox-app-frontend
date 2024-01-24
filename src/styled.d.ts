import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: string;
            secondary: string;
            tertiary: string;
            success: string;
            danger: string;
            disabled: string;
            toExplain: string;
        }
    }
}
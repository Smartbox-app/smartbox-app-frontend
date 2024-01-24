import React, { useMemo } from 'react';
import { useTenant } from '../../hooks/useTenant';
import { ThemeProvider } from 'styled-components';

interface Props {
    children: React.ReactNode;
}

const CustomThemeProvider = ({ children }: Props) => {
    const { tenant } = useTenant();

    const theme = useMemo(() => ({
        colors: {
            primary: tenant?.colorPrimary || '#eee',
            secondary: tenant?.colorSecondary || '#eee',
            success: '#00a45a',
            danger: '#a51727',
            tertiary: '#fbb03b',
            disabled: '#ccc',
            toExplain: "#000",
        }
    }), [tenant])

    if (!tenant) return null;

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}

export { CustomThemeProvider }
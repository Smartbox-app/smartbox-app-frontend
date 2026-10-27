import { lighten } from 'polished';
import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import { useTenant } from 'src/hooks/useTenant';

interface Props {
  children: React.ReactNode;
}

const CustomThemeProvider = ({ children }: Props) => {
  const { tenant } = useTenant();

  const theme = useMemo(
    () => ({
      spacing: 4,
      shadows: {
        primary: '0 16px 32px 0 rgba(178, 178, 178, 0.1)',
      },
      radius: {
        outerSurface: 20,
        innerSurface: 16,
      },
      colors: {
        text: {
          primary: '#252C32',
          secondary: '#6B7280',
          tertiary: '#9ca3af',
          disable: '#b0babf',
          accent: '#4094f7',
        },
        icon: {
          primary: tenant?.colorPrimary || '#3975d5',
          secondary: tenant?.colorSecondary || '#e2f2ff',
          tertiarty: lighten(0.1, tenant?.colorSecondary || '#e2f2ff'),
          grey: {
            primary: '#6b7280',
            secondary: '#849191A',
            tertiary: '#b0babf',
          },
        },
        surface: {
          primary: {
            disable: '#e7e7e7',
          },
          error: {
            secondary: '#ffefeb',
            primary: '#ef4444',
          },
          attention: {
            secondary: '#fffae7',
            primary: '#f8c513',
          },
          success: {
            secondary: '#ebfff1',
            primary: '#22c55e',
          },
          information: {
            secondary: '#e2f2ff',
            primary: '#4094f7',
          },
        },
        border: {
          primary: '#D1D5DB',
          secondary: '#e5e7eb',
          disable: '#b0babf',
          highlightPrimary: tenant?.colorPrimary || '#3975d5',
          tertiary: '#9ca3af',
          highlightSecondary: tenant?.colorSecondary || '#e2f2ff',
          accent: '#4094f7',
        },
        primary: tenant?.colorPrimary || '#3975d5',
        secondary: tenant?.colorSecondary || '#eee',
        dark: '#252c32',
        success: '#00a45a',
        danger: '#ef4444',
        tertiary: '#fbb03b',
        disabled: '#ccc',
        toExplain: '#000',
        background: {
          white: '#fff',
          primary: '#ffffff',
          secondary: '#f2f3f4',
          tertiary: '#fbfbfb',
        },
      },
    }),
    [tenant],
  );

  if (!tenant) return null;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { CustomThemeProvider };

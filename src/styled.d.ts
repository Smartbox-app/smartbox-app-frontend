import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    spacing: number;
    shadows: {
      primary: string;
    };
    radius: {
      outerSurface: number;
      innerSurface: number;
    };
    colors: {
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        disable: string;
        accent: string;
      };
      icon: {
        primary: string;
        secondary: string;
        tertiarty: string;
        grey: {
          primary: string;
          secondary: string;
          tertiary: string;
        };
      };
      surface: {
        primary: {
          disable: string;
        };
        attention: {
          primary: string;
          secondary: string;
        };
        success: {
          primary: string;
          secondary: string;
        };
        error: {
          primary: string;
          secondary: string;
        };
        information: {
          primary: string;
          secondary: string;
        };
      };
      border: {
        primary: string;
        secondary: string;
        tertiary: string;
        disable: string;
        highlightPrimary: string;
        highlightSecondary: string;
      };
      primary: string;
      secondary: string;
      tertiary: string;
      success: string;
      danger: string;
      disabled: string;
      toExplain: string;
      background: {
        white: string;
        primary: string;
        secondary: string;
        tertiary: string;
      };
    };
  }
}

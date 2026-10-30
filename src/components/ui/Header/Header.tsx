import { ReactNode } from 'react';
import styled from 'styled-components';

export type HeaderProps = {
  children: ReactNode;
  variant: 'main' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
};

const StyledMain = styled('h1')(({ theme }) => ({
  fontSize: '2.25rem',
  lineHeight: 1.5,
  fontWeight: 200,
  color: theme.colors.text.disable,
}));

const StyledH1 = styled('h2')(({ theme }) => ({
  fontSize: '1.375rem',
  lineHeight: '2rem',
  fontWeight: 700,
  color: theme.colors.text.primary,
}));

const StyledH2 = styled('h2')(({ theme }) => ({
  fontSize: '1.125rem',
  lineHeight: '1.5625rem',
  fontWeight: 700,
  color: theme.colors.text.secondary,
}));

const StyledH3 = styled('h3')(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
  color: theme.colors.text.secondary,
}));

const StyledH4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: '1.1rem',
  fontWeight: 700,
  color: theme.colors.text.secondary,
}));

const StyledH5 = styled('h5')(({ theme }) => ({
  fontSize: '0.875rem',
  lineHeight: '1.1rem',
  fontWeight: 700,
  color: theme.colors.text.secondary,
}));

export const Header = ({ variant, children }: HeaderProps) => {
  switch (variant) {
    case 'main':
      return <StyledMain>{children}</StyledMain>;
    case 'h1':
      return <StyledH1>{children}</StyledH1>;
    case 'h2':
      return <StyledH2>{children}</StyledH2>;
    case 'h3':
      return <StyledH3>{children}</StyledH3>;
    case 'h4':
      return <StyledH4>{children}</StyledH4>;
    case 'h5':
      return <StyledH5>{children}</StyledH5>;
  }
  return null;
};

import { ReactNode } from 'react';
import styled from 'styled-components';

export type HeaderProps = {
  children: ReactNode;
  variant: 'main' | 'h1' | 'h2' | 'h3';
};

const StyledMain = styled('h1')(({ theme }) => ({
  fontSize: 36,
  lineHeight: 1.5,
  fontWeight: 200,
  color: theme.colors.text.disable,
}));

const StyledH1 = styled('h2')(({ theme }) => ({
  fontSize: 22,
  lineHeight: '32px',
  fontWeight: 700,
  color: theme.colors.text.primary,
}));

const StyledH2 = styled('h2')(({ theme }) => ({
  fontSize: 18,
  lineHeight: '25px',
  fontWeight: 700,
  color: theme.colors.text.secondary,
}));

const StyledH3 = styled('h3')(({ theme }) => ({
  fontSize: 16,
  lineHeight: '22px',
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
  }
  return null;
};

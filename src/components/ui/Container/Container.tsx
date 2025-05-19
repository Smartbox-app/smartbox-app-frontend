import { ReactNode } from 'react';
import styled from 'styled-components';

export type ContainerProps = {
  children: ReactNode;
};

const StyledContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  padding: theme.spacing * 2,
  margin: '0 auto',
  '@media(min-idth: 768px)': {
    padding: theme.spacing * 5,
  }
}));

export const Container = ({ children }: ContainerProps) => {
  return <StyledContainer>{children}</StyledContainer>;
};

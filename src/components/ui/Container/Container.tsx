import { ReactNode } from 'react';
import styled from 'styled-components';

export type ContainerProps = {
  children: ReactNode;
};

const StyledContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 1000,
  padding: theme.spacing * 5,
  margin: '0 auto'
}));

export const Container = ({ children }: ContainerProps) => {
  return <StyledContainer>{children}</StyledContainer>;
};

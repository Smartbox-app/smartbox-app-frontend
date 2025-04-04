import { ReactNode } from 'react';
import styled from 'styled-components';

export type NarrowProps = {
  children: ReactNode;
};

const StyledWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 8,
  flex: 1,
  height: '100%',
  margin: '0 auto',
  '@media(min-width: 500px)': {
    width: '50%',
  },
}));

export const Narrow = ({ children }: NarrowProps) => {
  return (
    <StyledWrapper>
      {children}
      <span />
    </StyledWrapper>
  );
};

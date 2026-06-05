import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const StyledMain = styled('main')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 4,
  width: '100%',
  flex: 1,
}));

export const Main = ({ children }: Props) => <StyledMain>{children}</StyledMain>;

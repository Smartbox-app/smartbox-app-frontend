import React from 'react';
import { Footer } from '../index';
import './DashboardContainer.scss';
import { Container } from '../../ui';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const StyledDashboardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 4,
  width: '100%',
  minHeight: '100vh',
}));

export const DashboardContainer = ({ children }: Props) => {
  return (
    <Container>
      <StyledDashboardContainer>
        {children}
        <Footer />
      </StyledDashboardContainer>
    </Container>
  );
};

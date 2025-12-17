import React from 'react';
import { Footer } from '../index';
import './DashboardContainer.scss';
import { Container } from '../../ui';
import styled from 'styled-components';
import { PageContent } from 'src/components/Branded';

interface Props {
  children: React.ReactNode;
}

const StyledDashboardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 4,
  width: '100%',
  paddingBottom: theme.spacing * 24,
  '@media(min-width: 768px)': {
    paddingBottom: 0,
  }
}));

export const DashboardContainer = ({ children }: Props) => {
  return (
    <PageContent conditionalBg>
        <StyledDashboardContainer>
          {children}
          <Footer />
        </StyledDashboardContainer>
    </PageContent>
  );
};

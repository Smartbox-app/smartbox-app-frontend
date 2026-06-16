import { ReactNode } from 'react';
import { Header } from '../Header';
import { Section } from '../Section';
import styled from 'styled-components';
import { ArrowBack } from '../../../icons';
import { history } from 'src/history';

export type PageHeaderProps = {
  children: ReactNode;
};

const BackButton = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  svg: {
    fill: theme.colors.text.secondary,
  },
}));

const StyledPageHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 4,
}));

const StyledSection = styled(Section)(({ theme }) => ({
  padding: `${theme.spacing * 4}px ${theme.spacing * 6}px`,
}));

const goBack = () => {
  history.goBack();
};

export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <StyledSection>
      <StyledPageHeader>
        <BackButton onClick={goBack}>
          <ArrowBack />
        </BackButton>
        <Header variant="h1">{children}</Header>
      </StyledPageHeader>
    </StyledSection>
  );
};

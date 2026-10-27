import React from 'react';
import styled from 'styled-components';

import { ButtonsContainer } from 'src/components/Layout';

const StyledSingleTemplate = styled('li')<{ $set: boolean; $even: boolean }>(
  ({ $set, theme, $even }) => ({
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    background: $even
      ? theme.colors.background.tertiary
      : theme.colors.background.primary,
    borderLeft: $set ? `3px solid ${theme.colors.primary}` : 'none',
    justifyContent: 'space-between',
    padding: 10,
    gap: 5,
    flexWrap: 'wrap',
    flexDirection: 'column',
    '@media(min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }),
);

const MainData = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  flex: 1,
});

const StyledTemplateType = styled('span')`
  font-size: 0.8rem;
  font-weight: 700;
  margin-right: 5px;
  background: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
`;

const StyledTemplateInfo = styled('span')`
  font-size: 0.8rem;
  font-weight: 300;
  flex: 0 0 20%;
`;

const StyledTitle = styled('h3')`
  color: #333;
  margin: 10px 0;
  font-size: 0.9rem;
  flex: 0 0 100%;
  @media (min-width: 768px) {
    flex: 0 1 auto;
  }
`;

const Preview = styled('pre')(({ theme }) => ({
  flex: '1 0 100%',
  margin: 0,
  maxHeight: 180,
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  lineHeight: 1.4,
  color: theme.colors.text.secondary,
}));

export const SingleTemplate = ({
  type,
  title,
  info,
  preview,
  isSet,
  even,
  children,
}: {
  type: string;
  title: string;
  info?: string;
  preview?: string;
  isSet: boolean;
  even: boolean;
  children: React.ReactNode;
}) => (
  <StyledSingleTemplate $set={isSet} $even={even}>
    <MainData>
      <StyledTemplateType>{type}</StyledTemplateType>
      {info && <StyledTemplateInfo>{info}</StyledTemplateInfo>}
      <StyledTitle>{title}</StyledTitle>
    </MainData>
    <ButtonsContainer>{children}</ButtonsContainer>
    {preview && <Preview>{preview}</Preview>}
  </StyledSingleTemplate>
);

import React from 'react';
import { TemplateType } from 'smartbox-types';
import { Button } from '../../../../../components/Branded';
import { __ } from '../../../../../helpers/i18n';
import styled from 'styled-components';
import { ButtonsContainer } from '../../../../../components/Layout';

interface Props {
  type: 'email' | 'sms';
  template: TemplateType;
  isSet: boolean;
  index: number;
  manageTo: string;
}

const StyledSingleTemplate = styled('li')<{ isSet: boolean; even: boolean }>(
  ({ isSet, theme, even }) => ({
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    background: even
      ? theme.colors.background.tertiary
      : theme.colors.background.primary,
    borderLeft: isSet ? `3px solid ${theme.colors.primary}` : 'none',
    justifyContent: 'space-between',

    padding: 10,
    gap: 5,
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
  @media(min-width: 768px) {
    flex-direction: row;
    flex: 0 1 auto;
  }
`;

export const SingleTemplate = ({ type, template, isSet, index, manageTo }: Props) => {
  return (
    <StyledSingleTemplate isSet={isSet} even={index % 2 === 0}>
      <MainData>
        <StyledTemplateType>{type}</StyledTemplateType>
        <StyledTemplateInfo>
          {isSet
            ? __('application.templateSet')
            : __('application.defaultTemplateUsed')}
        </StyledTemplateInfo>
        <StyledTitle>{__(`templates.${template}`)}</StyledTitle>
      </MainData>
      <ButtonsContainer>
        <Button
          primary
          to={manageTo}
          text="application.manageTemplate"
        />
      </ButtonsContainer>
    </StyledSingleTemplate>
  );
};

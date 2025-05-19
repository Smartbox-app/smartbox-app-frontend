import React from 'react';
import { TemplateType } from 'smartbox-types';
import { Button } from '../../../../../components/Branded';
import { __ } from '../../../../../helpers/i18n';
import styled from 'styled-components';

interface Props {
  type: 'email' | 'sms';
  template: TemplateType;
  isSet: boolean;
  index: number;
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
    alignItems: 'center',
    padding: 10,
  }),
);

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
  flex: 1;
`;

export const SingleTemplate = ({ type, template, isSet, index }: Props) => {
  return (
    <StyledSingleTemplate isSet={isSet} even={index % 2 === 0}>
      <StyledTemplateType>{type}</StyledTemplateType>
      <StyledTemplateInfo>
        {isSet
          ? __('application.templateSet')
          : __('application.defaultTemplateUsed')}
      </StyledTemplateInfo>
      <StyledTitle>{__(`templates.${template}`)}</StyledTitle>
      <Button
        primary
        to={`/client/management/templates/manage/${type}/${template}`}
        text="application.manageTemplate"
      />
    </StyledSingleTemplate>
  );
};

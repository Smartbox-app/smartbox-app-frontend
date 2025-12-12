import React from 'react';
import { __ } from '../../../helpers/i18n';

import './Row.scss';
import styled from 'styled-components';
import { darken } from 'polished';
import { colorOrDark } from '../../../utils/color';

interface Props {
  label?: string;
  rawLabel?: string;
  content: React.ReactNode;
}

const StyledRow = styled.div`
  font-size: 14px;
  padding: ${(props) => props.theme.spacing * 4}px;
  border-bottom: 1px solid #fbfbfb;
  &:nth-child(odd) {
    background: ${(props) => props.theme.colors.background.tertiary};
  }
`;

const StyledRowLabel = styled.p`
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
`;

const Row = ({ label, rawLabel, content }: Props) => (
  <StyledRow className="row">
    {label && (
      <StyledRowLabel className="row-label">{__(label)}:</StyledRowLabel>
    )}
    {rawLabel && (
      <StyledRowLabel className="row-label">{rawLabel}:</StyledRowLabel>
    )}
    <strong className="row-content">{content || __('application.lack')}</strong>
  </StyledRow>
);

export default Row;

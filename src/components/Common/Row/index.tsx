import React from 'react';
import { __ } from '../../../helpers/i18n';

import './Row.scss';
import styled from 'styled-components';
import { colorOrDark } from '../../../utils/color';

interface Props {
  label?: string;
  rawLabel?: string;
  content: React.ReactNode;
  /** Optional content rendered to the left of the label (e.g. status color swatch). */
  left?: React.ReactNode;
  columns?: string;
}

const StyledRow = styled.div<{ $columns: string }>`
  font-size: 14px;
  padding: ${(props) => props.theme.spacing * 4}px;
  border-bottom: 1px solid #fbfbfb;
  display: block;

  &:nth-child(odd) {
    background: ${(props) => props.theme.colors.background.tertiary};
  }
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: ${(props) => props.$columns};
  }
`;

const LabelArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
  font-weight: 300;
`;

const Row = ({
  label,
  rawLabel,
  content,
  left,
  columns = '1fr 1fr',
}: Props) => (
  <StyledRow className="row" $columns={columns}>
    <LabelArea>
      {left}
      <span>
        {label ? `${__(label)}:` : null}
        {rawLabel ? `${rawLabel}:` : null}
      </span>
    </LabelArea>
    <strong className="row-content">{content || __('application.lack')}</strong>
  </StyledRow>
);

export default Row;

import React from 'react';
import { formatPrice } from '../../../../../../utils/format-price';
import { dateOnly } from '../../../../../../utils/format-date';

import './SummaryTable.scss';
import {__} from "../../../../../../helpers/i18n";
import styled from 'styled-components';
import { darken } from 'polished';


const StyledCell = styled.div`
color: ${props => props.theme.colors.primary};
`

const StyledRow = styled.div`
    border-bottom: 1px solid ${props => darken(0.1, props.theme.colors.primary)};
`

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: {
    value: number;
    isGross: boolean;
  };
}

const SummaryTable = ({ dateStart, dateEnd, countedPrice }: Props) => (
  <div className="order-summary-wrapper">
    <StyledRow className="row">
      <StyledCell className="cell">{__('application.startTerm')}</StyledCell>
      <StyledCell className="cell fat">
        <span>{dateOnly(dateStart)}</span>
      </StyledCell>
    </StyledRow>
    <StyledRow className="row">
      <StyledCell className="cell">{__('application.finishTerm')}</StyledCell>
      <StyledCell className="cell fat">
        <span>{dateOnly(dateEnd)}</span>
      </StyledCell>
    </StyledRow>
    <StyledRow className="row">
      <StyledCell className="cell">{countedPrice.isGross ? __('application.paymentForRent') :  __('application.netPaymentForRent')}</StyledCell>
      <StyledCell className="cell fat">
        <span>{formatPrice(countedPrice.value)}</span>
      </StyledCell>
    </StyledRow>
  </div>
);

export default SummaryTable;

import React from 'react';
import { GiftRes, GiftType } from 'smartbox-types';
import { SectionHeader } from '../../../../../../../../components/Layout';
import { __ } from '../../../../../../../../helpers/i18n';

import './NewCode.scss';
import styled from 'styled-components';

interface Props {
  newCodeProps: GiftRes;
}

const StyledCodeDetail = styled.strong`
color: ${props => props.theme.colors.primary}`

const getType = (type: GiftType) => {
  switch(type) {
    case GiftType.ReducePeriodByPercent: return 'application.giftReducePeriodByPercent';
    case GiftType.ReducePeriodByValue: return 'application.giftReducePeriodByValue';
    case GiftType.ReducePeriodToPrice: return 'application.giftReducePeriodToPrice';
  }
}

const NewCode = ({ newCodeProps }: Props) => (
  <div className="new-code-wrapper">
    <SectionHeader title='application.giftCodeGenerated' />
    <p>
      {__('application.giftCod')}: <StyledCodeDetail>{newCodeProps.code}</StyledCodeDetail>
    </p>
    <p>
      {__('application.giftType')}: <StyledCodeDetail>{__(getType(newCodeProps.type))}</StyledCodeDetail>
    </p>
    <p>
      {__('application.giftCodDiscount')}: <StyledCodeDetail>{newCodeProps.discount}</StyledCodeDetail>
    </p>
    <p>
      {__('application.minRentPeriod')}: <StyledCodeDetail>{newCodeProps.minRentPeriod}</StyledCodeDetail>
    </p>
    <p>
      {__('application.forTime')}:{' '}
      <StyledCodeDetail>
        {newCodeProps.duration} {__('application.days')}
      </StyledCodeDetail>
    </p>
  </div>
);

export { NewCode };

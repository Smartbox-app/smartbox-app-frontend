import React from 'react';
import { GiftRes, GiftType } from 'smartbox-types';
import { __ } from '../../../../../../../../helpers/i18n';
import { Modal } from 'src/components/ui';

import './NewCode.scss';
import styled from 'styled-components';
import { colorOrDark } from '../../../../../../../../utils/color';

interface Props {
  newCodeProps: GiftRes;
}

const StyledCodeDetail = styled.strong`
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
`;

const getType = (type: GiftType) => {
  switch (type) {
    case GiftType.ReducePeriodByPercent:
      return 'application.giftReducePeriodByPercent';
    case GiftType.ReducePeriodByValue:
      return 'application.giftReducePeriodByValue';
    case GiftType.ReducePeriodToPrice:
      return 'application.giftReducePeriodToPrice';
  }
};

const NewCode = ({ newCodeProps }: Props) => (
  <>
    <Modal.Header title={__('application.giftCodeGenerated')} />
    <Modal.Content>
      <div className="new-code-wrapper">
        <p>
          {__('application.giftCod')}:{' '}
          <StyledCodeDetail>{newCodeProps.code}</StyledCodeDetail>
        </p>
        <p>
          {__('application.giftType')}:{' '}
          <StyledCodeDetail>{__(getType(newCodeProps.type))}</StyledCodeDetail>
        </p>
        <p>
          {newCodeProps.type === GiftType.ReducePeriodToPrice
            ? __('application.reductionTo')
            : __('application.giftCodDiscount')}
          : <StyledCodeDetail>{newCodeProps.discount}</StyledCodeDetail>
        </p>
        <p>
          {__('application.minRentPeriod')}:{' '}
          <StyledCodeDetail>{newCodeProps.minRentPeriod}</StyledCodeDetail>
        </p>
        {newCodeProps.duration ? (
          <p>
            {__('application.forTime')}:{' '}
            <StyledCodeDetail>
              {newCodeProps.duration} {__('application.days')}
            </StyledCodeDetail>
          </p>
        ) : null}
      </div>
    </Modal.Content>
  </>
);

export { NewCode };

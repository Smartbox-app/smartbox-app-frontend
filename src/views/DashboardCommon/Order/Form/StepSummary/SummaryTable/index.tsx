import { useMemo } from 'react';
import { formatPrice } from '../../../../../../utils/format-price';
import { dateOnly } from '../../../../../../utils/format-date';

import './SummaryTable.scss';
import { __ } from '../../../../../../helpers/i18n';
import styled from 'styled-components';
import { darken } from 'polished';
import { AddonRes } from 'smartbox-types';
import { OrderAddon } from '../../../../../../reducers/order-reducer';
import { SelectedVariant } from './SelectedVariant';
import { colorOrDark } from '../../../../../../utils/color';
import { Header, Section } from 'src/components/ui';

const StyledCell = styled.div`
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
`;

const StyledRow = styled.div`
  border-bottom: 1px solid #fbfbfb;
`;

const StyledDetailsList = styled.ul`
  list-style-type: none;
`;

const StyledDetailsRow = styled.li(
  ({ theme }) => `
    border-bottom: 1px solid #fbfbfb;
       padding: 8px 0;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .row-dash {
    display: none;
    
    }
    
    &:nth-child(even) {
      background:${theme.colors.background.tertiary}
    }
  
      @media(min-width: 768px) {
          padding: 16px;
     padding: 16px;
     flex-direction: row;

     .row-dash {
     display: block;
     }
    }
`,
);

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: {
    value: number;
    isGross: boolean;
  };
  addons?: AddonRes[];
  orderAddons?: { [addonId: string]: OrderAddon };
}

const SummaryTable = ({
  dateStart,
  dateEnd,
  countedPrice,
  addons,
  orderAddons,
}: Props) => {
  const fullPrice = useMemo(() => {
    if (!orderAddons) return countedPrice.value;

    const addonsPrice = Object.values(orderAddons).reduce(
      (acc, curr) => acc + (curr.price ? curr.price.value : 0),
      0,
    );
    return addonsPrice + countedPrice.value;
  }, [countedPrice, orderAddons]);

  return (
    <>
      <div className="order-summary-wrapper">
        <StyledRow className="row">
          <StyledCell className="cell">
            <Header variant="h2">{__('application.startTerm')}</Header>
          </StyledCell>
          <StyledCell className="cell fat">
            <span>{dateOnly(dateStart)}</span>
          </StyledCell>
        </StyledRow>
        <StyledRow className="row">
          <StyledCell className="cell">
            <Header variant="h2">{__('application.finishTerm')}</Header>
          </StyledCell>
          <StyledCell className="cell fat">
            <span>{dateOnly(dateEnd)}</span>
          </StyledCell>
        </StyledRow>
        <StyledRow className="row">
          <StyledCell className="cell">
            <Header variant="h2">
              {countedPrice.isGross
                ? __('application.grossPayment')
                : __('application.netPayment')}
            </Header>
          </StyledCell>
          <StyledCell className="cell fat">
            <span>{formatPrice(fullPrice)}</span>
          </StyledCell>
        </StyledRow>
      </div>
      <Header variant="h2">{__('application.priceDetails')}</Header>
      <StyledDetailsList>
        <StyledDetailsRow>
          {countedPrice.isGross
            ? __('application.paymentForRent')
            : __('application.netPaymentForRent')}
              <span className='row-dash'>-</span>
          <strong>{formatPrice(countedPrice.value)}</strong>
        </StyledDetailsRow>
        {addons && orderAddons
          ? addons.map((addon) => (
              <StyledDetailsRow key={addon.id}>
                <span>{addon.name}</span>
                <span className='row-dash'>-</span>
                <SelectedVariant
                  addonId={addon.id}
                  addons={addons}
                  orderAddons={orderAddons}
                />
              </StyledDetailsRow>
            ))
          : null}
      </StyledDetailsList>
    </>
  );
};

export default SummaryTable;

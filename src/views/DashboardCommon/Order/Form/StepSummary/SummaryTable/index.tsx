import React, { useMemo } from 'react';
import { formatPrice } from '../../../../../../utils/format-price';
import { dateOnly } from '../../../../../../utils/format-date';

import './SummaryTable.scss';
import { __ } from "../../../../../../helpers/i18n";
import styled from 'styled-components';
import { darken } from 'polished';
import { AddonRes } from 'smartbox-types';
import { OrderAddon } from '../../../../../../reducers/order-reducer';
import { SelectedVariant } from './SelectedVariant';
import { Section } from '../../../../../../components/Layout';
import { colorOrDark } from '../../../../../../utils/color';


const StyledCell = styled.div`
color: ${props => colorOrDark(props.theme.colors.primary)};
`

const StyledRow = styled.div`
    border-bottom: 1px solid ${props => darken(0.1, props.theme.colors.primary)};
`

const StyledAddonsList = styled.ul`
    list-style-type: none
`

const StyledAddonsHeader = styled.h3`
    color: #333;`

const StyledAddonRow = styled.li`
    border-bottom: 1px solid ${props => darken(0.1, props.theme.colors.primary)};
    border-left: 3px solid ${props => darken(0.1, props.theme.colors.primary)};
    padding: 10px;
    marcin-bottom: 10px;
    
h4 {
    color: #333;
    }
`

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: {
    value: number;
    isGross: boolean;
  };
  addons?: AddonRes[];
  orderAddons?: { [addonId: string]: OrderAddon }
}

const SummaryTable = ({ dateStart, dateEnd, countedPrice, addons, orderAddons }: Props) => {
  const fullPrice = useMemo(() => {
    if (!orderAddons) return countedPrice.value;

    const addonsPrice = Object.values(orderAddons).reduce((acc, curr) => acc + (curr.price ? curr.price.value : 0), 0);
    return addonsPrice + countedPrice.value;
  }, [countedPrice, orderAddons])

  return <Section highlight>
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
        <StyledCell className="cell">{countedPrice.isGross ? __('application.paymentForRent') : __('application.netPaymentForRent')}</StyledCell>
        <StyledCell className="cell fat">
          <span>{formatPrice(fullPrice)}</span>
        </StyledCell>
      </StyledRow>

    </div>
    {(addons && orderAddons) ? <div>
      <StyledAddonsHeader>{__('application.selectedAddons')}</StyledAddonsHeader>
      <StyledAddonsList>
        {addons.map(addon => <StyledAddonRow key={addon.id}>
          <h4>{addon.name}</h4>
          <SelectedVariant addonId={addon.id} addons={addons} orderAddons={orderAddons} />
        </StyledAddonRow>)}
      </StyledAddonsList> </div> : null}
  </Section>
}

export default SummaryTable;

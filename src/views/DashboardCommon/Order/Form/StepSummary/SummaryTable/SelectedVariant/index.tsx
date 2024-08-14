import React from 'react';
import { AddonRes } from 'smartbox-types';
import { OrderAddon } from '../../../../../../../reducers/order-reducer';
import { formatPrice } from '../../../../../../../utils/format-price';
import styled from 'styled-components';

interface Props {
    addons?: AddonRes[];
    orderAddons?: { [addonId: string]: OrderAddon };
    addonId: string;
}

const StyledSelectedVariant = styled('div')`
display: flex;
justify-content: space-between;
`

export const SelectedVariant = ({ addons, orderAddons, addonId }: Props) => {
    if (!addons || !orderAddons) return null;
    const selectedAddon = addons.find(addon => addon.id === addonId);

    if (!selectedAddon) return null;
    const selectedVariant = selectedAddon.pricing.find(variant => variant.id === orderAddons[addonId].selectedVariant)

    if (!selectedVariant) return null;

    return <StyledSelectedVariant>
        <strong>{selectedVariant.name} </strong> {formatPrice(orderAddons[addonId].price?.value || 0)}
    </StyledSelectedVariant>
}
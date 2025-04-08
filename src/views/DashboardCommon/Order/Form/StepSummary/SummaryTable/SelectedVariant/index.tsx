import React from 'react';
import { AddonRes } from 'smartbox-types';
import { OrderAddon } from '../../../../../../../reducers/order-reducer';
import { formatPrice } from '../../../../../../../utils/format-price';
import styled from 'styled-components';
import { __ } from '../../../../../../../helpers/i18n';

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
    if (!addons || !orderAddons) return <StyledSelectedVariant>
        <strong>{__('application.variantNotSelected')}</strong>
    </StyledSelectedVariant>

    const selectedAddon = addons.find(addon => addon.id === addonId);

    if (!selectedAddon) return <StyledSelectedVariant>
        <strong>{__('application.variantNotSelected')}</strong>
    </StyledSelectedVariant>

    const selectedVariant = selectedAddon.pricing.find(variant => variant.id === orderAddons[addonId].selectedVariant)

    if (!selectedVariant) return <StyledSelectedVariant>
        <strong>{__('application.variantNotSelected')}</strong>
    </StyledSelectedVariant>

    return <StyledSelectedVariant>
        {selectedVariant ? <><strong>{selectedVariant.name}</strong><span>-</span>{formatPrice(orderAddons[addonId].price?.value || 0)}</> : <strong>{__('application.variantNotSelected')}</strong>}
    </StyledSelectedVariant>
}
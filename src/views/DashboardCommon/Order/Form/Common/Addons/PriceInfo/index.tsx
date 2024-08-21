import React from 'react';
import { AddonPricingType, SingleAddonPricing, SingleAddonVariant } from 'smartbox-types';
import styled from 'styled-components';
import { __ } from '../../../../../../../helpers/i18n';
import { formatPrice } from '../../../../../../../utils/format-price';
import { PricingType } from '../../../../../../../../../smartbox-back/types/box-group/pricing';

interface Props {
    isGross: boolean;
    variant: SingleAddonVariant;
}

const StyledPriceInfo = styled.div`
display: flex;
justify-content: center;
background-color: ${props => props.theme.colors.secondary};
color: #fff;
font-size: 0.9rem;
padding: 10px;

.price-value {
    margin-left: 5px;
}

.price-type {
    margin-left: 5px;
}
`

const formatQuantity = (type: AddonPricingType, quantity: number) => {
    switch (type) {
        case AddonPricingType.Day: {
            if (quantity > 1) return 'dni';
            return 'dzień'
        }
        case AddonPricingType.Week: {
            if (quantity >= 5) return 'tygodni'
            if (quantity > 1) return 'tygodnie';
            return 'tydzień'
        }

        case AddonPricingType.Month: {
            if (quantity >= 5) return 'miesięcy'
            if (quantity > 1) return 'miesiące';
            return 'miesiąc'
        }

        case AddonPricingType.Year: {
            if (quantity >= 5) return 'lat'
            if (quantity > 1) return 'lata';
            return 'rok'
        }
    }
}

const PriceInfo = ({ variant, isGross }: Props) => {
    const firstPricing = variant.pricing[0];

    if (!firstPricing.price || !firstPricing.quantity) return null;

    return <StyledPriceInfo>
        {__('application.rentFrom')}<strong className='price-value'>{formatPrice(firstPricing.price || 0)}</strong><span className='price-type'>{isGross ? __('application.gross') : __('application.net')}</span>/<span>{firstPricing.quantity} {formatQuantity(firstPricing.type, firstPricing.quantity || 0)}</span>
    </StyledPriceInfo>
}

export { PriceInfo }
import React from 'react';
import { BoxGroupUserRes } from 'smartbox-types';
import styled from 'styled-components';
import { __ } from '../../../../../../helpers/i18n';
import { formatPrice } from '../../../../../../utils/format-price';
import { PricingType } from '../../../../../../../../smartbox-back/types/box-group/pricing';

interface Props {
    box: BoxGroupUserRes;
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

const formatQuantity = (type: PricingType, quantity: number) => {
    switch (type) {
        case PricingType.Day: {
            if (quantity > 1) return 'dni';
            return 'dzień'
        }
        case PricingType.Week: {
            if (quantity >= 5) return 'tygodni'
            if (quantity > 1) return 'tygodnie';
            return 'tydzień'
        }

        case PricingType.Month: {
            if (quantity >= 5) return 'miesięcy'
            if (quantity > 1) return 'miesiące';
            return 'miesiąc'
        }

        case PricingType.Year: {
            if (quantity >= 5) return 'lat'
            if (quantity > 1) return 'lata';
            return 'rok'
        }
    }
}

const PriceInfo = ({ box }: Props) => {
    const firstPricing = box.pricing[0];

    if (!firstPricing.price || !firstPricing.quantity) return null;

    return <StyledPriceInfo>
        {__('application.rentFrom')}<strong className='price-value'>{formatPrice(firstPricing.price || 0)}</strong><span className='price-type'>{firstPricing.isGross ? __('application.gross') : __('application.net')}</span>/<span>{firstPricing.quantity} {formatQuantity(firstPricing.type, firstPricing.quantity || 0)}</span>
    </StyledPriceInfo>
}

export { PriceInfo }
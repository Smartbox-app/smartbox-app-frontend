import React, { useMemo } from 'react';
import styled from 'styled-components';

import {
  AddonVariantPriceType,
  SingleAddonVariantForUserWithCorrectedPrice,
  PriceDisplayForClients,
} from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { useI18n } from 'src/i18n';
import { formatPeriodQuantity } from 'src/utils/format-period-quantity';
import { formatPrice } from 'src/utils/format-price';

interface Props {
  display: PriceDisplayForClients;
  variant: SingleAddonVariantForUserWithCorrectedPrice;
}

const StyledPriceInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: theme.colors.surface.success.secondary,
  borderRadius: theme.spacing * 2,
  padding: theme.spacing * 2,
  color: theme.colors.surface.success.primary,
  '.price-type': {
    marginLeft: 5,
  },
}));

const PriceInfo = ({ variant, display }: Props) => {
  const {
    priceType,
    netPrice: fixedNetPrice,
    grossPrice: fixedGrossPrice,
    pricing,
  } = variant;
  const { t } = useI18n();
  const priceInfo = useMemo(() => {
    const netPrice =
      priceType === AddonVariantPriceType.Fixed
        ? fixedNetPrice
        : pricing[0].netPrice;
    const grossPrice =
      priceType === AddonVariantPriceType.Fixed
        ? fixedGrossPrice
        : pricing[0].grossPrice;

    switch (display) {
      case PriceDisplayForClients.gross:
        return (
          <>
            <strong className="price-value">
              {formatPrice(grossPrice || 0)}
            </strong>
            <span className="price-type">{t('application.gross')}</span>
          </>
        );
      case PriceDisplayForClients.net:
        return (
          <>
            <strong className="price-value">
              {formatPrice(netPrice || 0)}
            </strong>
            <span className="price-type">{t('application.net')}</span>
          </>
        );
      case PriceDisplayForClients.both:
        return (
          <>
            <strong className="price-value">
              {formatPrice(grossPrice || 0)}
            </strong>
            <span className="price-type">{t('application.gross')}</span>/
            <span className="price-value">{formatPrice(netPrice || 0)}</span>
            <span className="price-type">{t('application.net')}</span>
          </>
        );
    }
  }, [variant, display]);

  if (priceType === AddonVariantPriceType.Fixed) {
    return <StyledPriceInfo>{priceInfo}</StyledPriceInfo>;
  }

  const firstPricing = pricing[0];

  if (!firstPricing.price || !firstPricing.quantity || !firstPricing.type) {
    return null;
  }

  return (
    <StyledPriceInfo>
      {priceInfo}/
      <span>
        {firstPricing.quantity}{' '}
        {formatPeriodQuantity(firstPricing.type, firstPricing.quantity || 0)}
      </span>
    </StyledPriceInfo>
  );
};

export { PriceInfo };

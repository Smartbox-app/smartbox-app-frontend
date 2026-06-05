import React from 'react';
import { AddonRes, PriceDisplayForClients } from 'smartbox-types';
import { OrderAddon } from '../../../../../../../reducers/order-reducer';
import { formatPrice } from '../../../../../../../utils/format-price';
import styled from 'styled-components';
import { __ } from '../../../../../../../helpers/i18n';
import { Header } from 'src/components/ui';

interface Props {
  addonName: string;
  addons?: AddonRes[];
  orderAddons?: { [addonId: string]: OrderAddon };
  addonId: string;
}

const StyledSelectedVariant = styled('div')`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`;

const StyledVariantPrice = styled('div')`
  font-size: 14px;
  font-weight: 300;
`;

export const SelectedVariant = ({
  addonName,
  addons,
  orderAddons,
  addonId,
}: Props) => {
  console.log('SELECTED VARIANT', orderAddons, addons, addonId);
  const formatVariantPrice = (addon: OrderAddon, selectedAddon: AddonRes) => {
    const addonPricing = (addon.price || [])[0];
    switch (selectedAddon.display) {
      case PriceDisplayForClients.gross:
        return <strong>{formatPrice(addonPricing.grossPrice)}</strong>;
      case PriceDisplayForClients.net:
        return <strong>{formatPrice(addonPricing.netPrice)}</strong>;
      case PriceDisplayForClients.both:
        return (
          <>
            <strong>
              {formatPrice(addonPricing.grossPrice)} {__('application.gross')}
            </strong>
            /{formatPrice(addonPricing.netPrice)} {__('application.net')}
          </>
        );
    }
  };

  if (!addons || !orderAddons)
    return (
      <>
        <Header variant="h3">{addonName}</Header>
        <strong>{__('application.variantNotSelected')}</strong>
      </>
    );

  const selectedAddon = addons.find((addon) => addon.id === addonId);

  if (!selectedAddon)
    return (
      <>
        <Header variant="h3">{addonName}</Header>
        <strong>{__('application.variantNotSelected')}</strong>
      </>
    );

  const selectedVariant = selectedAddon.pricing.find(
    (variant) => variant.id === orderAddons[addonId].selectedVariant,
  );

  if (!selectedVariant)
    return (
      <>
        <Header variant="h3">{addonName}</Header>
        <strong>{__('application.variantNotSelected')}</strong>
      </>
    );

  return (
    <>
      {selectedVariant ? (
        <>
          <div>
            <Header variant="h3">{addonName}</Header>
            <strong>{selectedVariant.name}</strong>
          </div>

          <StyledVariantPrice>
            {formatVariantPrice(orderAddons[addonId], selectedAddon)}
          </StyledVariantPrice>
        </>
      ) : (
        <strong>{__('application.variantNotSelected')}</strong>
      )}
    </>
  );
};

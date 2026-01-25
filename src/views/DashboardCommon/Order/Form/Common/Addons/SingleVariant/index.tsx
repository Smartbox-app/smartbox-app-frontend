import React, { useMemo } from 'react';
import {
  AddonRes,
  AddonUserFileRequirementType,
  SingleAddonVariant,
} from 'smartbox-types';
import styled from 'styled-components';
import { PriceInfo } from '../PriceInfo';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../../reducers';
import { selectAddon, setAddonFile } from '../../../../../../../actions/order';
import { Indicator } from './components/Indicator';

const StyledAddonVariant = styled('li')<{ isSelected: boolean }>(
  ({ isSelected, theme }) => ({
    padding: `${theme.spacing * 3}px 0`,
    color: theme.colors.text.primary,
    fontWeight: isSelected ? 500 : 400,
    // marginBottom: 10,
    borderRadius: 5,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing * 2,

    '@media (min-width: 768px)': {
      flexDirection: 'row',
      gap: theme.spacing * 4,
      justifyContent: 'flex-start',
    },
  }),
);

const VariantSelect = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2
}))

const StyledVariantName = styled('h5')({
  margin: '5px 0',
  fontSize: '1rem',
});

interface Props {
  addon: AddonRes;
  addonId: string;
  isGross: boolean;
  variant: SingleAddonVariant;
}

export const SingleVariant = ({ variant, addonId, addon, isGross }: Props) => {
  const { orderAddons } = useSelector((state: ApplicationState) => state.order);
  const dispatch = useDispatch();

  const isSelected = useMemo(() => {
    if (!orderAddons[addonId]) return false;
    return orderAddons[addonId].selectedVariant === variant.id;
  }, [orderAddons, addonId]);

  const selectVariant = () => {
    if (
      orderAddons[addonId].userFileRequirement ===
      AddonUserFileRequirementType.RequiredWhenNoVariant
    ) {
      dispatch(setAddonFile(addonId, null));
    }
    dispatch(
      selectAddon(
        addonId,
        isSelected ? null : variant.id,
        isSelected ? null : variant.name,
      ),
    );
  };

  const variantWithCorrectedPrice = useMemo(() => {
    const parsedTax = parseInt(addon.tax);

    if(isNaN(parsedTax)) return variant;

    if(isGross && variant.price) {
      return {
        ...variant,
        price: variant.price * (1 + Number(addon.tax) / 100)
      }
    }

    return variant
  }, [variant])

  return (
    <StyledAddonVariant
      isSelected={isSelected}
      role="button"
      onClick={selectVariant}
    >
      <VariantSelect>
        <Indicator selected={isSelected} />
        <StyledVariantName>{variant.name}</StyledVariantName>
      </VariantSelect>
      <PriceInfo variant={variantWithCorrectedPrice} isGross={isGross} />
    </StyledAddonVariant>
  );
};

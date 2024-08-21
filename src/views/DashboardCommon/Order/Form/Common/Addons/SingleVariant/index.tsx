import React, { useMemo } from 'react';
import { SingleAddonVariant } from "smartbox-types"
import styled from "styled-components"
import { PriceInfo } from '../PriceInfo';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../../reducers';
import { selectAddon } from '../../../../../../../actions/order';

const StyledAddonVariant = styled('li')<{ isSelected: boolean }>(({ isSelected, theme }) => ({
    padding: 10,
    border: `1px solid ${isSelected ? theme.colors.primary : '#333'}`,
    marginBottom: 10,
    borderRadius: 5,
    cursor: 'pointer',

    '&:hover': {
        background: '#eee',
    },

    '@media (min-width: 480px)': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
}))

const StyledVariantName = styled('h5')({
    margin: '5px 0',
    fontWeight: 700,
    fontSize: '1rem',
    color: '#000'
})

interface Props {
    addonId: string;
    isGross: boolean;
    variant: SingleAddonVariant;
}

export const SingleVariant = ({ variant, addonId, isGross }: Props) => {
    const { orderAddons } = useSelector((state: ApplicationState) => state.order);
    const dispatch = useDispatch();

    const isSelected = useMemo(() => {
        console.log('ORDER ADDONS', orderAddons);
        if (!orderAddons[addonId]) return false;
        return orderAddons[addonId].selectedVariant === variant.id
    }, [orderAddons, addonId])

    const selectVariant = () => {
        console.log('TRYING TO SELECT', addonId, variant.id);
        dispatch(selectAddon(addonId, isSelected ? null : variant.id));
    }

    return (
        <StyledAddonVariant isSelected={isSelected} role='button' onClick={selectVariant}>
            <StyledVariantName>{variant.name}</StyledVariantName>
            <PriceInfo variant={variant} isGross={isGross} />
        </StyledAddonVariant>
    )
}
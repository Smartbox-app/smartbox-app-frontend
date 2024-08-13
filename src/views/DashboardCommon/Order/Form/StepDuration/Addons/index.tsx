import React, { useEffect } from "react";
import { useState } from "react"
import { AddonRes } from "smartbox-types"
import { Spinner } from "../../../../../../components/Branded";
import { Section, SectionHeader } from "../../../../../../components/Layout";
import ApiService from "../../../../../../services/api-service";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../../../../../reducers";
import styled from "styled-components";
import { PriceInfo } from "./PriceInfo";

const StyledAddonVariant = styled('li')(({ theme }) => ({
    padding: 10,
    border: `1px solid ${theme.colors.primary}`,
    marginBottom: 10,
    borderRadius: 5,
    cursor: 'pointer',

    '@media (min-width: 480px)': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
}))

const StyledAddonDescription = styled('p')({
    margin: '10px 0',
})

const StyledAddonHeader = styled('h4')({
    margin: '10px 0',
    fontWeight: 700,
    fontSize: '1.1rem'
})

const StyledVariantName = styled('h5')({
    margin: '5px 0',
    fontWeight: 700,
    fontSize: '1rem',
    color: '#000'
})

export const Addons = () => {
    const { stockId } = useSelector((state: ApplicationState) => state.order);
    const [addons, setAddons] = useState<AddonRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getAddons = async () => {
        await ApiService.callFetch('GET', `addon/all/${stockId}`, (data: AddonRes[]) => {
            setAddons(data);
        })
        setLoading(false);
    }

    useEffect(() => {
        getAddons();
    }, [])

    if (loading) return <Spinner />

    return <Section highlight>
        {addons.map(addon => <Section>
            <StyledAddonHeader>{addon.name}</StyledAddonHeader>
            <StyledAddonDescription>{addon.description}</StyledAddonDescription>
            <ul>
                {addon.pricing.map((variant, variantIndex) => <StyledAddonVariant key={variantIndex}>
                    <StyledVariantName>{variant.name}</StyledVariantName>
                    <PriceInfo variant={variant} isGross={addon.isGross} />
                </StyledAddonVariant>)}
            </ul>
        </Section>)}
    </Section>
}
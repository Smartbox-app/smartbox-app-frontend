import React, { useEffect } from "react";
import { useState } from "react"
import { AddonRes } from "smartbox-types"
import { Spinner } from "../../../../../../components/Branded";
import { Section, SectionHeader } from "../../../../../../components/Layout";
import ApiService from "../../../../../../services/api-service";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../../../../reducers";
import styled from "styled-components";
import { PriceInfo } from "./PriceInfo";
import { Alert } from "../../../../../../components/Common";
import { fetchAddons } from "../../../../../../actions/order";
import { SingleVariant } from "./SingleVariant";



const StyledAddonDescription = styled('p')({
    margin: '10px 0',
})

const StyledAddonHeader = styled('h4')({
    margin: '10px 0',
    fontWeight: 700,
    fontSize: '1.1rem'
})

interface Props {
    stockId: string;
}


export const Addons = ({ stockId }: Props) => {
    const { addons, loadingAddons } = useSelector((state: ApplicationState) => state.order);
    const dispatch = useDispatch();

    const getAddons = () => {
        dispatch(fetchAddons(stockId));
    }

    useEffect(() => {
        getAddons();
    }, [])

    if (loadingAddons) return <Spinner />
    if (!addons || addons.length === 0) return null;

    return <Section highlight>
        {addons.map(addon => <Section>
            <StyledAddonHeader>{addon.name}</StyledAddonHeader>
            <StyledAddonDescription>{addon.description}</StyledAddonDescription>
            {addon.required ? <Alert type='notice' text="application.addonIsRequired" /> : null}
            <ul>
                {addon.pricing.map((variant) => <SingleVariant key={variant.id} variant={variant} addonId={addon.id} isGross={addon.isGross} />
                )}
            </ul>
        </Section>)}
    </Section>
}
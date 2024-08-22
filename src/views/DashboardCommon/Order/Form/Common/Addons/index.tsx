import React, { useEffect } from "react";
import { Button, Spinner } from "../../../../../../components/Branded";
import { ButtonsContainer, Section } from "../../../../../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../../../../reducers";
import styled from "styled-components";
import { Alert, CheckBox } from "../../../../../../components/Common";
import { fetchAddons, setAddonAcceptance } from "../../../../../../actions/order";
import { SingleVariant } from "./SingleVariant";
import ApiService from "../../../../../../services/api-service";



const StyledAddonDescription = styled('p')({
    margin: '10px 0',
})

const StyledFileDescription = styled('div')(({ theme }) => ({
    margin: '10px 0',
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: 4,
    padding: 10
}))

const StyledAddonHeader = styled('h4')({
    margin: '10px 0',
    fontWeight: 700,
    fontSize: '1.1rem'
})

interface Props {
    stockId: string;
}


export const Addons = ({ stockId }: Props) => {
    const { addons, loadingAddons, orderAddons } = useSelector((state: ApplicationState) => state.order);
    const dispatch = useDispatch();

    const getAddons = () => {
        dispatch(fetchAddons(stockId));
    }

    const handleAddonAcceptance = (addonId: string, checked: boolean) => {
        dispatch(setAddonAcceptance(addonId, checked));
    }

    useEffect(() => {
        getAddons();
    }, [])

    if (loadingAddons) return <Spinner />
    if (!addons || addons.length === 0) return null;

    return <Section highlight>
        {addons.map(addon => <Section>
            <StyledAddonHeader>{addon.name}</StyledAddonHeader>
            <StyledAddonDescription>
                {addon.description}
            </StyledAddonDescription>
            {addon.file && addon.fileText ? <StyledFileDescription>
                <p>{addon.fileText}</p>
                <ButtonsContainer>
                    <Button primary text='application.seeFile' blank to={`${ApiService.url}addon/file/${addon.id}/${addon.file}`} />
                </ButtonsContainer>
            </StyledFileDescription> : null}
            {addon.required ? <Alert type='notice' text="application.addonIsRequired" /> : null}
            {addon.acceptance ? <CheckBox label={addon.acceptance} name='acceptance' checked={orderAddons[addon.id].accepted} handleChange={(checked: boolean) => handleAddonAcceptance(addon.id, checked)} /> : null}
            <ul>
                {addon.pricing.map((variant) => <SingleVariant key={variant.id} variant={variant} addonId={addon.id} isGross={addon.isGross} />
                )}
            </ul>
        </Section>)}
    </Section>
}
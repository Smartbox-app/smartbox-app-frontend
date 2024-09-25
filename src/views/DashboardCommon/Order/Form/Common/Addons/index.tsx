import React, { useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "../../../../../../components/Branded";
import { ButtonsContainer, Section } from "../../../../../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../../../../reducers";
import styled from "styled-components";
import { Alert, CheckBox } from "../../../../../../components/Common";
import { fetchAddons, setAddonAcceptance, setAddonFile } from "../../../../../../actions/order";
import { SingleVariant } from "./SingleVariant";
import ApiService from "../../../../../../services/api-service";
import FileInput from "../../../../../../components/Common/FileInput";
import { AddonRes, AddonUserFileRequirementType } from "smartbox-types";
import { OrderAddon } from "src/reducers/order-reducer";



const StyledAddonDescription = styled('p')({
    margin: '10px 0',
})

const StyledFileDescription = styled('div')(({ theme }) => ({
    margin: '10px 0',
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: 4,
    padding: 10
}))

const StyledUserFileContainer = styled('div')(({ theme }) => ({
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

const StyledSingleAddon = styled('div')(({ theme }) => ({
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: `1px solid ${theme.colors.secondary}`
}))

interface Props {
    stockId: string;
}


export const Addons = ({ stockId }: Props) => {
    const { addons, loadingAddons, orderAddons } = useSelector((state: ApplicationState) => state.order);
    const dispatch = useDispatch();

    const getAddons = () => {
        dispatch(fetchAddons(stockId));
    }

    const handleAddonAcceptance = (addonId: string, acceptanceId: string, checked: boolean) => {
        dispatch(setAddonAcceptance(addonId, acceptanceId, checked));
    }

    const handleAddonFile = (addonId: string, file: File | null) => {
        dispatch(setAddonFile(addonId, file));
    }

    useEffect(() => {
        getAddons();
    }, [])

    const displayFileInput = ({ userFileAllowed, userFileText, userFileRequirement }: AddonRes, { selectedVariant }: OrderAddon) => {
        if(!userFileAllowed || !userFileText) return false;
        if(userFileRequirement === AddonUserFileRequirementType.RequiredWhenNoVariant && selectedVariant) return false;
        return true;
    }

    if (loadingAddons) return <Spinner />
    if (!addons || addons.length === 0) return null;

    return <Section highlight>
        {addons.map(addon => <StyledSingleAddon key={addon.id}>
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
            {addon.acceptances ? addon.acceptances.map(acceptance => <div key={acceptance.id}>
                <CheckBox label={acceptance.text} name={`acceptance_${acceptance.id}`} checked={orderAddons[addon.id].acceptancesStatus[acceptance.id].accepted} handleChange={(checked: boolean) => handleAddonAcceptance(addon.id, acceptance.id, checked)} />
            </div>) : null}
            <ul>
                {addon.pricing.map((variant) => <SingleVariant key={variant.id} variant={variant} addonId={addon.id} isGross={addon.isGross} />
                )}
            </ul>
            {displayFileInput(addon, orderAddons[addon.id]) ? <StyledUserFileContainer>
                <p>{addon.userFileText}</p>
                <FileInput input={{
                    value: orderAddons[addon.id].file,
                    onChange: (file: File | null) => handleAddonFile(addon.id, file)
                }}
                accept='.jpg,.jpeg,.png,.pdf,.docx'
                multiple={false}
                meta={{
                    error: null
                }}
                />
            </StyledUserFileContainer> : null}
        </StyledSingleAddon>)}
    </Section>
}
import React from "react";
import { RentDescription } from "smartbox-types"
import { dateOnly } from "../../../utils/format-date";
import { formatPrice } from "../../../utils/format-price";
import { __ } from "../../../helpers/i18n";
import styled from "styled-components";
import { Button } from "../../../components/Branded";
import ApiService from "../../../services/api-service";
import { ButtonsContainer } from "../../../components/Layout";

interface Props {
    description: RentDescription[];
    rentId: string;
}

const StyledPeriodHeader = styled('h4')({
    color: '#333',
    fontWeight: 700,
    fontSize: '1rem',
    marginBottom: '10px'
})
const StyledAddonsHeader = styled('h4')({
    color: '#333',
    fontWeight: 700,
    margin: '10px 0',
    fontSize: '0.95rem'
})

const StyledSinglePeriod = styled('li')(({ theme }) => ({
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: `1px solid ${theme.colors.primary}`
}))

const StyledSingleAddon = styled('li')(({ theme }) => ({
    marginBottom: '10px',
    paddingLeft: 10,
    borderLeft: `5px solid ${theme.colors.secondary}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
}))

const StyledRentAgreementButton = styled('div')({
    display: 'flex'
})


export const RentHistory = ({ description, rentId }: Props) => {
    return (

        <ul>
            {description.map((line, index) => <StyledSinglePeriod key={index}>
                <StyledPeriodHeader>{dateOnly(line.startAt)} - {dateOnly(line.finishAt)}</StyledPeriodHeader>
                <p>{__('application.price')} - {formatPrice(Number(line.cost))}</p>
                {line.agreement ? <StyledRentAgreementButton><Button small primary blank text='application.seeRentAgreement' to={`${ApiService.url}rent/agreement/${rentId}/${index}`} /></StyledRentAgreementButton> : null}

                {(line.addons && line.addons.length > 0) ? (
                    <div>
                        <StyledAddonsHeader>{__('application.selectedAddons')}</StyledAddonsHeader>
                        <ul>
                            {line.addons.map(addon => <StyledSingleAddon key={addon.id}>
                                <div><strong>{addon.name}</strong> - {addon.selectedVariantName} - {formatPrice(Number(addon.price))}</div>

                              
                                {addon.acceptance ? <p>{addon.acceptance} - <strong>{addon.accepted ? 'Tak' : 'Nie'}</strong></p> : null}
                                {(!!addon.acceptances && !!addon.acceptancesStatus) ?
                                    addon.acceptances.map(acceptance => <p key={acceptance.id}>
                                        {acceptance.text} - <strong>{addon.acceptancesStatus![acceptance.id].accepted ? 'Tak' : 'Nie'}</strong>
                                    </p>)
                                    : null}
                                {addon.file ? <Button small blank primary to={`${ApiService.url}rent/file/${rentId}/${addon.file}`} text='application.seeAttachedFile' /> : null}
                            </StyledSingleAddon>)}
                        </ul>
                    </div>
                ) : null}
            </StyledSinglePeriod>)}
        </ul>
    )
}
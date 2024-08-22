import React from "react";
import { RentDescription } from "smartbox-types"
import { dateOnly } from "../../../utils/format-date";
import { formatPrice } from "../../../utils/format-price";
import { __ } from "../../../helpers/i18n";
import styled from "styled-components";

interface Props {
    description: RentDescription[];
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

export const RentHistory = ({ description }: Props) => {
    return (

        <ul>
            {description.map((line, index) => <StyledSinglePeriod key={index}>
                <StyledPeriodHeader>{dateOnly(line.startAt)} - {dateOnly(line.finishAt)}</StyledPeriodHeader>
                <p>{__('application.price')} - {formatPrice(Number(line.cost))}</p>
                {(line.addons && line.addons.length > 0) ? (
                    <div>
                        <StyledAddonsHeader>{__('application.selectedAddons')}</StyledAddonsHeader>
                        <ul>
                            {line.addons.map(addon => <li key={addon.id}>
                                <div><strong>{addon.name}</strong> - {addon.selectedVariantName} - {formatPrice(Number(addon.price))}</div>
                                {addon.acceptance ? <p>{addon.acceptance} - <strong>{addon.accepted ? 'Tak' : 'Nie'}</strong></p> : null}
                            </li>)}
                        </ul>
                    </div>
                ) : null}
            </StyledSinglePeriod>)}
        </ul>
    )
}
import React from 'react';
import { TemplateType } from "smartbox-types";
import { Button } from '../../../../../components/Branded';
import { __ } from "../../../../../helpers/i18n";
import styled from 'styled-components';

interface Props {
    type: 'email' | 'sms';
    template: TemplateType;
    isSet: boolean;
}

const StyledSingleTemplate = styled('li')<{ isSet: boolean }>(({ isSet, theme }) => ({
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    background: '#fff',
    borderLeft: isSet ? `3px solid ${theme.colors.primary}` : 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    boxShadow: '0 15px 20px -15px rgba(50, 50, 50, 0.4)'
}))

const StyledTemplateType = styled('span')`
    font-size: 0.8rem;
    font-weight: 700;
    margin-right: 5px;
    background: #333;
    color: #fff;
    padding: 5px;
    border-radius: 4px;
`

const StyledTemplateInfo = styled('span')`
font-size: 0.8rem;
font-weight: 300;`

const StyledTitle = styled('h3')`
    color: #333;
    margin: 10px 0;
    font-size: 0.9rem;
`

export const SingleTemplate = ({ type, template, isSet }: Props) => {
    return <StyledSingleTemplate isSet={isSet}>
        <span>
            <StyledTemplateType>{type}</StyledTemplateType>
            <StyledTemplateInfo>{isSet ? __('application.templateSet') : __('application.defaultTemplateUsed')}</StyledTemplateInfo>
            <StyledTitle>{__(`templates.${template}`)}</StyledTitle>
        </span>
        <Button primary to={`/client/management/templates/manage/${type}/${template}`} text='application.manageTemplate' />
    </StyledSingleTemplate>
}
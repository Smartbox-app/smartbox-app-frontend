import React from 'react';
import { __ } from '../../../helpers/i18n';

import './Row.scss';
import styled from 'styled-components';

interface Props {
    label: string;
    content: React.ReactNode;
}

const StyledRowLabel = styled.p`
    color: ${props => props.theme.colors.primary};
`

const Row = ({ label, content }: Props) => (
    <div className="row">
        <StyledRowLabel className="row-label">{__(label)}:</StyledRowLabel>
        <strong className="row-content">{content || __('application.lack')}</strong>
    </div>
);

export default Row;

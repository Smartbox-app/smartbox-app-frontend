import React from 'react';

import { TranslatableObject } from '../../../utils/errors-trans';
import { __ } from "../../../helpers/i18n";
import { InputErrors } from '../InputErrors';
import './CheckBox.scss';
import { InputHelp } from '../InputHelp';
import styled from 'styled-components';
import { getColorForBackground } from '../../../utils/color';

interface Props {
    name: string;
    checked: boolean;
    handleChange: (checked: boolean) => void;
    label?: string | React.ReactNode;
    disabled?: boolean;
    errors?: TranslatableObject[];
    hide?: boolean;
    help?: string;
}

const StyledCheckbox = styled.div`
    [type='checkbox']:checked + label:before {
        border-color: ${props => props.theme.colors.primary};
    }

    [type='checkbox']:checked + label:after,
    [type='checkbox']:not(:checked) + label:after {
        background: ${props => props.theme.colors.primary};
        color: ${props => getColorForBackground(props.theme.colors.primary)};
}
`

const CheckBox = ({ label, name, checked, handleChange, disabled, help, errors, hide }: Props) => (
    <StyledCheckbox className={`checkbox ${disabled ? 'checkbox-disabled' : ''} ${hide && 'checkbox-hide'}`}>
        <input
            type="checkbox"
            id={name}
            name={name}
            onChange={(e: any) => handleChange(e.target.checked)}
            checked={!!checked}
            disabled={disabled}
        />
        <label htmlFor={name}>{__(label)}</label>
        {errors && <InputErrors errors={errors} />}
        {help && <InputHelp text={help} />}
    </StyledCheckbox>
);

export default CheckBox;

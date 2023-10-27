import React from 'react';

import { TranslatableObject } from '../../../utils/errors-trans';
import { __ } from "../../../helpers/i18n";
import { InputErrors } from '../InputErrors';
import './CheckBox.scss';

interface Props {
    name: string;
    checked: boolean;
    handleChange: (checked: boolean) => void;
    label?: string | React.ReactNode;
    disabled?: boolean;
    errors?: TranslatableObject[];
    hide?: boolean;
}

const CheckBox = ({ label, name, checked, handleChange, disabled, errors, hide }: Props) => (
    <div className={`checkbox ${disabled ? 'checkbox-disabled' : ''} ${hide && 'checkbox-hide'}`}>
        <input
            type="checkbox"
            id={name}
            name={name}
            onChange={(e: any) => handleChange(e.target.value)}
            checked={!!checked}
            disabled={disabled}
        />
        <label htmlFor={name}>{__(label)}</label>
        {errors && <InputErrors errors={errors} />}
    </div>
);

export default CheckBox;

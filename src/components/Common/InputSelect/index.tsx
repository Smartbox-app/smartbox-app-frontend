
import clsx from 'clsx';
import React, { useRef } from 'react';
import { ReactSelect } from '../../../App';
import { __ } from '../../../helpers/i18n';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputErrors } from '../InputErrors';
import './InputSelect.scss';
import styled from 'styled-components';
import { InputHelp } from '../InputHelp';
import { InputLabel } from 'src/components/ui/InputLabel';


interface Props {
    options: { label: string; value: string | number }[];
    onChange: any;
    value: any;
    big?: boolean;
    help?: string;
    placeholder: any;
    name: string;
    label?: string;
    multiple?: boolean;
    noMargin?: boolean;
    compact?: boolean;
    readonly?: boolean;
    allowCustomValue?: boolean;
    errors?: TranslatableObject[];
}

const StyledContainer = styled.div`
&.big {
    .input-select__control {
        border: 2px solid ${props => props.theme.colors.primary};
    }
}
&.compact {
    .input-select__control {
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
}
`

const InputSelect = ({
    options,
    value,
    onChange,
    placeholder,
    multiple,
    errors,
    compact,
    help,
    noMargin,
    big,
    readonly,
    label,
    name,
    allowCustomValue,
}: Props) => {
    const selector = useRef<any>(null);

    const handleBlur = () => {
        const { inputValue, value } = selector.current.state;
        if (inputValue)
            selector.current.onChange(
                inputValue ? { label: inputValue, value: inputValue } : value
            );
    };

    const handleClick = (e: any) => {
        if (e.keyCode === 13) {
            const { inputValue, value } = selector.current.state;
            selector.current.onChange(
                inputValue ? { label: inputValue, value: inputValue } : value
            );
        }
    };

    const getDefaultValue = () => {
        if (multiple) {
            return value
                ? value.map((val: string) => {
                    return options.find((opt) => opt.value === val);
                })
                : [];
        } else {
            const found = options.find((opt) => opt.value === value);
            if (found) return found;

            if (!found && allowCustomValue) {
                return { label: value, value };
            }
        }
    };

    const handleChange = (val: null | any[] | any) => {
        if (multiple) onChange(val || []);
        else if ((typeof val !== 'undefined') && val !== null) onChange(val.value);
        else onChange(null);
    };

    return <StyledContainer className={`input-select-container ${big ? 'big' : 'compact'} ${errors && errors.length > 0 ? 'is-invalid' : ''}`}>
        <InputLabel labelFor={name}>{__(label)}</InputLabel>
        <ReactSelect
            menuPortalTarget={
                document.body
            }
            menuPlacement="auto"
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            isDisabled={readonly}
            defaultValue={getDefaultValue()}
            className={clsx('input-select', { compact })}
            classNamePrefix="input-select"
            inputId="input-select-field"
            onChange={handleChange}
            options={options}
            onBlurResetsInput={false}
            onBlur={handleBlur}
            onKeyDown={handleClick}
            formatCreateLabel={() => false}
            isValidNewOption={() => false}
            noOptionsMessage={() => null}
            isClearable
            creatable={true}
            isMulti={multiple}
            placeholder={placeholder ? __(placeholder) : ''}
            ref={selector}
        />
        {errors && <InputErrors errors={errors} />}
        {help && <InputHelp text={help} />}
    </StyledContainer>
};

export { InputSelect };

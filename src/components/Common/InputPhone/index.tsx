import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { InputLabel } from '../InputLabel';
import { InputErrors } from '../InputErrors';
import { TranslatableObject } from '../../../utils/errors-trans';
import './InputPhone.scss';
import styled from 'styled-components';

interface Props {
    value: any;
    label: string;
    name: string;
    onChange: (e: any) => void;
    big?: boolean;
    errors?: TranslatableObject[];
}

const StyledContainer = styled.div`
&.big {
    .PhoneInput {
        border: 2px solid ${props => props.theme.colors.primary};
    }
}
&.compact {
    .PhoneInput {
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
}
`

const InputPhone = ({ value, label, name, big, errors, onChange }: Props) => {
    return <StyledContainer className={`input-phone-container ${big ? 'big' : 'compact'} ${errors && errors.length > 0 ? 'is-invalid' : ''}`}>
        <InputLabel label={label} name={name} />
        <PhoneInput
            withCountryCallingCode
            country='PL'
            defaultCountry='PL'
            value={value}
            onChange={onChange} />
        {errors && <InputErrors errors={errors} />}
    </StyledContainer>
}

export { InputPhone }
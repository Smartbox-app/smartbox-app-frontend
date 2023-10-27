import * as React from 'react';
import { __ } from '../../../helpers/i18n';
import { InputLabel } from '../InputLabel';
import { InputHelp } from '../InputHelp';
import { InputErrors } from '../InputErrors';
import './Input.scss';
import styled, { css } from 'styled-components';

interface Props {
    type: string;
    input: any;
    error?: any;
    meta?: any;
    touched?: any;
    min?: number;
    max?: boolean;
    step?: number;
    value?: any;
    options?: any[];
    readonly?: boolean;
    required?: boolean;
    nomargin?: boolean;
    help?: string;
    onChange?: (value: string) => void;
    dark?: boolean;
    className?: string;
    big?: boolean;
}

const errorClass = (errors: any[] | undefined) => (errors && errors.length ? 'is-invalid' : '');

const StyledContainer = styled.div`
&.big {
    .input {
        border: 2px solid ${props => props.theme.colors.primary};
    }
}
&.compact {
    .input {
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
}
`

const Input = (props: Props) => {
    const containerClass = `input-container ${props.big ? 'big' : 'compact'} ${props.className || ''} ${props.max ? 'input-max' : ''} ${props.nomargin ? 'nomargin' : ''
        } ${props.type === 'hidden' ? 'hidden' : ''}`;

    if (props.type === 'select') {
        const options = props.options
            ? props.options.map((option) => (
                <option disabled={option.disabled} key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))
            : null;
        return (
            <StyledContainer className={containerClass}>
                <div className="input-wrapper">
                    <InputLabel label={props.input.label} name={props.input.name} />
                    <select
                        value={props.input.value || '0'}
                        className={`input input-${props.type} ${props.max ? 'input-max' : ''} ${props.nomargin ? 'nomargin' : ''
                            } ${errorClass(props.input.errors)}`}
                        id={props.input.name}
                        {...props.input}
                        placeholder={props.input.placeholder}
                    >
                        {options}
                    </select>
                </div>
                {props.input.errors && <InputErrors big={props.big} errors={props.input.errors} />}
            </StyledContainer>
        );
    } else if (props.type === 'textarea') {
        return (
            <StyledContainer className={containerClass}>
                <div className="input-wrapper">
                    <InputLabel label={props.input.label} name={props.input.name} />
                    <textarea
                        className={`input input-${props.type} ${errorClass(props.input.errors)}`}
                        id={props.input.name}
                        readOnly={props.readonly}
                        {...props.input}
                        placeholder={props.input.placeholder}
                    />
                </div>
                {props.input.errors && <InputErrors big={props.big} errors={props.input.errors} />}
            </StyledContainer>
        );
    } else {
        return (
            <StyledContainer className={containerClass}>
                <InputLabel label={props.input.label} name={props.input.name} />
                <div className="input-wrapper">
                    <input
                        className={`input ${props.dark ? 'dark' : ''} input-${props.type} ${errorClass(props.input.errors)}`}
                        id={props.input.name}
                        readOnly={props.readonly}
                        {...props.input}
                        placeholder={props.input.placeholder}
                        type={props.type}
                        min={props.min || 0}
                        step={props.step || 1}
                    />
                </div>
                {props.input.errors && <InputErrors big={props.big} errors={props.input.errors} />}
                {props.help && <InputHelp text={props.help} />}
            </StyledContainer>
        );
    }
};
export default Input;

import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import { __ } from "../../../helpers/i18n";
import { useTenant } from '../../../hooks/useTenant';
import './Button.scss';
import { colorOrDark, getColorForBackground } from '../../../utils/color';


interface ButtonProps {
    to?: string;
    click?: any;
    primary?: boolean;
    secondary?: boolean;
    danger?: boolean;
    success?: boolean;
    outline?: boolean;
    disabled?: boolean;
    tertiary?: boolean;
    auto?: boolean;
    type?: string;
    text: string;
    big?: boolean;
    small?: boolean;
    className?: string;
    blank?: boolean;
    rounded?: boolean;
    icon?: string;
    onlyIcon?: boolean;
}

enum ButtonType {
    Submit = 'submit',
    Button = 'button',
    Reset = 'reset',
}

const buttonStyles = css`
        &.button-primary {
            background: ${props => props.theme.colors.primary};
            color: ${props => getColorForBackground(props.theme.colors.primary)};
            &:hover {
              background: ${props => lighten(0.1, props.theme.colors.primary)};
            }
        }

        &.button-secondary {
            background: ${props => props.theme.colors.secondary};
            color: ${props => getColorForBackground(props.theme.colors.secondary)};
            &:hover {
              background: ${props => lighten(0.1, props.theme.colors.secondary)};
            }
        }

        &.button-outline {
            border: 2px solid ${props => props.theme.colors.primary};
            color: ${props => colorOrDark(props.theme.colors.primary)};

            &:hover {
                box-shadow: inset 0 -1px 1px -1px ${props => props.theme.colors.primary};
            }
        }
        
    `

const StyledButton = styled.button`${buttonStyles}`
const StyledA = styled.a`${buttonStyles}`
const StyledLink = styled(Link)`${buttonStyles}`

const Button = (props: ButtonProps) => {
    const {
        className,
        danger,
        primary,
        secondary,
        success,
        tertiary,
        small,
        disabled,
        outline,
        big,
        auto,
        to,
        type,
        blank,
        click,
        text,
        rounded,
        icon,
        onlyIcon,
    } = props;

    const setButtonType = (userinput = 'button'): any => {
        switch (userinput) {
            case ButtonType.Button:
                return 'button';
            case ButtonType.Submit:
                return 'submit';
            default:
                return 'button';
        }
    };

    const imgLink = `/assets/icons/${icon}`;
    const imgComponent = <img className="button-img" src={imgLink} alt="img" />;

    const buttonClass = `button
    ${className || ''} ${primary ? 'button-primary' : ''} ${secondary ? 'button-secondary' : ''}
    ${danger ? 'button-danger' : ''} ${success ? 'button-success' : ''}
    ${outline ? 'button-outline' : ''} ${big ? 'button-big' : ''}
    ${small ? 'button-small' : ''} ${auto ? 'auto' : ''}
    ${icon ? 'with-icon' : ''} ${onlyIcon ? 'only-icon' : ''}
    ${disabled ? 'disabled' : ''} ${rounded ? 'rounded' : ''} ${tertiary ? 'button-tertiary' : ''}`;

    if (to) {
        if (disabled) {
            return (
                <StyledA className={buttonClass}>
                    {icon && imgComponent}
                    {!onlyIcon && __(text)}
                </StyledA>
            );
        }
        if (blank) {
            return (
                <StyledA target="_blank" rel="noopener noreferrer" className={buttonClass} href={to}>
                    {icon && imgComponent}
                    {!onlyIcon && __(text)}
                </StyledA>
            );
        }
        return (
            <StyledLink className={buttonClass} to={to}>
                {icon && imgComponent}
                {!onlyIcon && __(text)}
            </StyledLink>
        );
    }

    return (
        <StyledButton type={setButtonType(type) || 'button'} disabled={disabled} onClick={click} className={buttonClass}>
            {icon && imgComponent}
            {!onlyIcon && __(text)}
        </StyledButton>
    );
};

export { Button };

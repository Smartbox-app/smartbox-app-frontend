import * as React from 'react';
import styled from 'styled-components';
import './Spinner.scss';

interface Props {
    overlay?: boolean;
    small?: boolean;
    transparent?: boolean;
    halfTransparent?: boolean;
    dark?: boolean;
    fading?: boolean;
}

const StyledSpinnerContainer = styled.div``


const StyledSpinner = styled.div`
border: 3px solid  ${props => props.theme.colors.primary} ;
border-color: ${props => props.theme.colors.primary} transparent transparent transparent;

`

const Spinner = ({ overlay, transparent, halfTransparent, dark, small, fading }: Props) => (
    <StyledSpinnerContainer
        className={`spinner-container ${overlay ? 'overlay' : ''}
    ${small ? 'small' : ''} ${transparent ? 'transparent' : ''} 
    ${halfTransparent ? 'half-transparent' : ''} 
    ${dark ? 'dark' : ''}
    ${fading ? 'fading' : ''}
    `}
    >
        <StyledSpinner className="spinner" />
    </StyledSpinnerContainer>
);

export { Spinner };

import React from 'react';
import { ReactSVG } from 'react-svg';

import './SingleOption.scss';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Branded';
import styled from 'styled-components';

interface Props {
    loading: boolean;
    register?: any;
    disable?: boolean;
    name: string;
    value: string;
    address: string;
}

const StyledSingleOptionWrapper = styled.div`
input[type='radio']:checked+.single-option {
    border: 2px solid ${props => props.theme.colors.primary}
}
`

const SingleOption = ({ register, name, address, value, disable, loading }: Props) => {
    if (loading) return <Spinner />;
    return (
        <StyledSingleOptionWrapper className="single-stock-wrapper">
            <input
                name="stock"
                type="radio"
                value={value}
                id={value}
                ref={register({ required: true })}
                disabled={disable}
            />
            <label htmlFor={value} className={`single-option ${disable ? 'single-option-disable' : ''}`}>
                <h3>{name}</h3>
                <span>{address}</span>
            </label>
        </StyledSingleOptionWrapper>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    loading: state.spinner.loading,
});

export default connect(mapStateToProps)(SingleOption);

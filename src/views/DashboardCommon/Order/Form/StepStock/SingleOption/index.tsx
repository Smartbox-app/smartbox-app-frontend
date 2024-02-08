import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { ReactSVG } from 'react-svg';

import './SingleOption.scss';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Branded';
import styled from 'styled-components';
import { setOrderStock } from '../../../../../../actions/order';
import { transparentize } from 'polished';

interface Props {
    loading: boolean;
    name: string;
    value: string;
    address: string;
    disable?: boolean;
    secondary?: boolean;
}

const StyledSingleOptionWrapper = styled.div`
input[type='radio']:checked+.single-option {
    border: 1px solid ${props => props.theme.colors.primary};
    background-color: ${props => transparentize(0.9, props.theme.colors.primary)};
}
`

const SingleOption = ({ name, address, value, disable, loading, secondary }: Props) => {
    const dispatch = useDispatch();
    const stockId = useSelector((state: ApplicationState) => state.order.stockId);

    const selectOption = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setOrderStock(value));
    }

    if (loading) return <Spinner />;
    return (
        <StyledSingleOptionWrapper className="single-stock-wrapper">
            <input
                name="stock"
                type="radio"
                value={value}
                id={value}
                checked={value === stockId}
                onChange={selectOption}
                disabled={disable}
            />
            <label htmlFor={value} className={`single-option ${disable ? 'single-option-disable' : ''}`}>
                {secondary ? <h4>{name}</h4> : <h3>{name}</h3>}
                <span>{address}</span>
            </label>
        </StyledSingleOptionWrapper>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    loading: state.spinner.loading,
});

export default connect(mapStateToProps)(SingleOption);

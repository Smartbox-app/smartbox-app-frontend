import React from 'react';
import { ReactSVG } from 'react-svg';

import './SingleOption.scss';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Common';

interface Props {
    loading: boolean;
    register?: any;
    disable?: boolean;
    name: string;
    value: string;
    address: string;
}

const SingleOption = ({ register, name, address, value, disable, loading }: Props) => {
    if (loading) return <Spinner />;
    return (
        <div className="single-stock-wrapper">
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
        </div>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    loading: state.spinner.loading,
});

export default connect(mapStateToProps)(SingleOption);

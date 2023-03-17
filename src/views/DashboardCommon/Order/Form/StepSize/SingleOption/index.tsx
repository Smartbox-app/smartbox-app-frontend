import React from 'react';
import { ReactSVG } from 'react-svg';

import './SingleOption.scss';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Common';

export type SingleOptionType = {
  name: string;
  value: string;
  id: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  imgAddress?: string;
};

interface Props {
  singleOptionData: SingleOptionType;
  loading: boolean;
  register?: any;
  disable?: boolean;
}

const SingleOption = ({ register, singleOptionData, disable, loading }: Props) => {
  if (loading) return <Spinner />;
  return (
    <div className="single-option-wrapper">
      <input
        name={singleOptionData.name}
        type="radio"
        value={singleOptionData.value}
        id={singleOptionData.id}
        ref={register({ required: true })}
        disabled={disable}
      />
      <label htmlFor={singleOptionData.id} className={`single-option ${disable ? 'single-option-disable' : ''}`}>
        <div className="radio-img">
          <span className={`img-value ${disable ? 'img-value-disabled' : ''}`}>{disable ? 'BRAK' : ''}</span>
          {singleOptionData.imgAddress && (
            <div className="svg-wrapper">
              <ReactSVG src={`/assets/icons/${singleOptionData.imgAddress}.svg`} />
            </div>
          )}
          <p className="img-description">
            {singleOptionData.sizeX} m x {singleOptionData.sizeY} m x {singleOptionData.sizeZ} m
          </p>
        </div>
      </label>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  loading: state.spinner.loading,
});

export default connect(mapStateToProps)(SingleOption);

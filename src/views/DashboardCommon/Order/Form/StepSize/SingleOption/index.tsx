import React from 'react';

import './SingleOption.scss';

export type SingleOptionType = {
  name: string;
  value: number;
  id: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  imgAddress?: string;
};

interface Props {
  singleOptionData: SingleOptionType;
  register?: any;
  disable?: boolean;
}

const SingleOption = ({ register, singleOptionData, disable }: Props) => (
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
        <span className={`img-value ${disable ? 'img-value-disabled' : ''}`}>
          {disable ? 'BRAK' : `${singleOptionData.value}m2`}
        </span>
        {singleOptionData.imgAddress && <img src={singleOptionData.imgAddress} alt="container" />}
        <p className="img-description">
          {singleOptionData.sizeX}m x {singleOptionData.sizeY}m x {singleOptionData.sizeZ}m
        </p>
      </div>
    </label>
  </div>
);

export default SingleOption;

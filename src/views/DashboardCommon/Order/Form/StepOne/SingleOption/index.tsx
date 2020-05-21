import React from 'react';
import { useForm } from 'react-hook-form';

import './SingleOption.scss';

interface Props {
  name: string;
  value: number;
  id: string;
  imgAddress?: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  register: any;
}

const SingleOption = (props: Props) => (
  <div className="single-option-wrapper">
    <input name={props.name} type="radio" value={props.value} id={props.id} ref={props.register({ required: true })} />
    <label htmlFor={props.id} className="single-option">
      <div className="radio-img">
        <span className="img-value">{props.value}m2</span>
        {props.imgAddress && <img src={props.imgAddress} alt="container" />}
        <p className="img-description">
          {props.sizeX}m x {props.sizeY}m x {props.sizeZ}m
        </p>
      </div>
    </label>
  </div>
);

export default SingleOption;

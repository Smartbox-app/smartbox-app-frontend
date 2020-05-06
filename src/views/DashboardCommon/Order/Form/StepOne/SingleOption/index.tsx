import React from 'react';
import { useForm } from 'react-hook-form';

import './SingleOption.scss';

interface Props {
  name: string;
  value: any;
  id: string;
  refOption: {};
  imgAddress?: string;
}

const SingleOption = (props: Props) => {
  const { register } = useForm();
  return (
    <>
      <input
        name={props.name}
        type="radio"
        value={props.value}
        id={props.id}
        // ref={register({ required: true, ...props.refOption })}
        ref={register({ required: true })}
      />
      <label htmlFor={props.id} className="single-option">
        <div className="radio-img">{props.imgAddress && <img src={props.imgAddress} alt="container" />}</div>
      </label>
    </>
  );
};

export default SingleOption;

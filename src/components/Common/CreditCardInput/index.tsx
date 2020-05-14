import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../Input';

const CreditCardInput = () => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <div className="credit-card-input-wrapper">
      <input type="text" placeholder="0000 0000 0000 0000" name="card-number" ref={register({ required: true })} />
      <input type="text" placeholder="First name" name="first-name" ref={register({ required: true })} />
      <input type="text" placeholder="Last name" name="last-name" ref={register({ required: true })} />

      <input
        type="tel"
        placeholder="Mobile number"
        name="Mobile number"
        ref={register({ required: true, minLength: 6, maxLength: 12 })}
      />
      <select name="Title" ref={register({ required: true })}>
        <option value="Mr">Mr</option>
        <option value="Mrs">Mrs</option>
        <option value="Miss">Miss</option>
        <option value="Dr">Dr</option>
      </select>

      <input name="Developer" type="radio" value="Yes" ref={register({ required: true })} />
      <input name="Developer" type="radio" value="No" ref={register({ required: true })} />

      <input type="submit" />
    </div>
  );
};

export default CreditCardInput;

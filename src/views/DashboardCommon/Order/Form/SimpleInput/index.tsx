import React from 'react';

interface Props {
  label: string;
  fieldName: string;
  register: any;
  required: boolean;
  errors?: any;
}

const SimpleInput = ({ label, register, required, errors, fieldName }: Props) => (
  <>
    <label>{label}</label>
    <input name={fieldName} ref={register({ required })} />
    {/* {errors[label] && <p>{errors[label].message}</p>} */}
    {errors[label] && <p>Pole jest wymagane</p>}
    {console.log(errors[fieldName])}
  </>
);

export default SimpleInput;

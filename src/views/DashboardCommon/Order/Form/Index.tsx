import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import DatePicker from 'react-date-picker';
import { Input, DateInput } from '../../../../components/Common';
import SimpleInput from './SimpleInput';

const Form = () => {
  const [date, setDate] = useState(new Date());

  const defaultValues = {
    firstName: 'test',
    dateStart: date,
  };
  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => console.log('onSubmit', data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleInput fieldName="firstName" label="First Name" register={register} required errors={errors} />
      {/* <DateInput label="Start date" register={register} required errors={errors} /> */}
      <Controller name="dateStart" control={control} as={DateInput} register required value={date} />
      <input type="submit" />
    </form>
  );
};

export default Form;

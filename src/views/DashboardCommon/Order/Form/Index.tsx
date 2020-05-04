import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DateInput } from '../../../../components/Common';
import SimpleInput from './SimpleInput';
import { order } from '../../../../actions';

interface Props {
  formData: {};
  UpdateFormData: (data: any) => void;
}

const Form = (props: Props) => {
  const [date, setDate] = useState(new Date());

  console.log('formData', props.formData);

  const defaultValues = {
    firstName: '',
    dateStart: date,
  };
  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => console.log('onSubmit', data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleInput fieldName="firstName" label="First Name" register={register} required errors={errors} />
      <Controller name="dateStart" control={control} as={DateInput} register required value={date} errors={errors} />
      <input type="submit" />
    </form>
  );
};

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Form);

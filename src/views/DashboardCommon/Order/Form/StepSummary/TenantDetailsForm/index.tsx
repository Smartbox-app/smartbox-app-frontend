import React from 'react';
import CustomInput from '../../../../../../components/Common/CustomInput';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { formOnTranslateString } from '../../../../../../utils/trans-form';

interface Props {
  register: any;
  errors: any;
  control: any;
}

const TenantDetailsForm = ({ register, errors, control }: Props) => {
  return (
    <div className="form-field">
      <FormHeader title="Dane najemcy:" />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="firstName"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="lastName"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="street"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="city"
      />
      <CustomInput
        register={register({
          required: formOnTranslateString('Field required.'),
          pattern: {
            value: /^([0-9]{2})(-[0-9]{3})?$/i,
            message: formOnTranslateString('Invalid Zip code.'),
          },
        })}
        errors={errors}
        control={control}
        id="postCode"
      />

      <CustomInput
        register={register({
          required: formOnTranslateString('Field required.'),
          pattern: {
            value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: formOnTranslateString('Invalid email.'),
          },
        })}
        errors={errors}
        control={control}
        type="email"
        id="mailToSendInvoice"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="phone"
      />
    </div>
  );
};

export default TenantDetailsForm;

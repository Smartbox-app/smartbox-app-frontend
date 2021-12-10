import React from 'react';
import CustomInput from '../../../../../../components/Common/CustomInput';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import {__} from "../../../../../../helpers/i18n";

interface Props {
  register: any;
  errors: any;
  control: any;
  disabled?: boolean;
}

const TenantDetailsForm = ({ register, errors, control, disabled }: Props) => {
  return (
    <div className="form-field">
      <FormHeader title='application.rentierData' />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        disabled
        id="firstName"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        disabled
        id="lastName"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="street"
        disabled={disabled}
        placeholder="ul. Główna 12/3"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="city"
        disabled={disabled}
        placeholder="Warszawa"
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
        disabled={disabled}
        placeholder="00-001"
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
        disabled
        placeholder="example@gmail.com"
      />
      <CustomInput
        register={register({
          required: formOnTranslateString('Field required.'),
          pattern: {
            value: /^(([0-9]|-|\(|\)|\+| ){9,14})/i,
            message: formOnTranslateString('Invalid phone number'),
          },
        })}
        errors={errors}
        control={control}
        disabled
        id="phone"
      />
    </div>
  );
};

export default TenantDetailsForm;

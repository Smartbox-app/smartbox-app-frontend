import React from 'react';
import CustomInput from '../../../../../../components/Common/CustomInput';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { formOnTranslateString } from '../../../../../../utils/trans-form';

interface Props {
  register: any;
  errors: any;
  control: any;
}

const CompanyDetailsForm = ({ register, errors, control }: Props) => {
  return (
    <div className="form-field">
      <FormHeader title="Dane firmy:" />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyName"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyStreet"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyCity"
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
        id="companyPostCode"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="nip"
      />
    </div>
  );
};

export default CompanyDetailsForm;

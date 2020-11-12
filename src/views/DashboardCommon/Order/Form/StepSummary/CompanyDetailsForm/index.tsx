import React from 'react';
import CustomInput from '../../../../../../components/Common/CustomInput';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { validateNip } from '../../../../../../utils/validate-nip';

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
        placeholder={formOnTranslateString('')}
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyStreet"
        placeholder="ul. Główna 12/3"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyCity"
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
        id="companyPostCode"
        placeholder="00-001"
      />
      <CustomInput
        register={register({
          required: formOnTranslateString('Field required.'),
          validate: (data: any) => (validateNip(data) || formOnTranslateString('Invalid NIP.')),
        })}
        errors={errors}
        control={control}
        id="nip"
        placeholder="NIP"
      />
    </div>
  );
};

export default CompanyDetailsForm;

import React from 'react';
import CustomInput from '../../../../../../components/Common/CustomInput';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { validateNip } from '../../../../../../utils/validate-nip';
import {__} from "../../../../../../helpers/i18n";

interface Props {
  register: any;
  errors: any;
  control: any;
  disabled?: boolean;
}

const CompanyDetailsForm = ({ register, errors, control, disabled }: Props) => {
  return (
    <div className="form-field">
      <FormHeader title='application.companyData' />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyName"
        disabled={disabled}
        placeholder={formOnTranslateString('')}
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyStreet"
        disabled={disabled}
        placeholder="ul. Główna 12/3"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        control={control}
        id="companyCity"
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
        id="companyPostCode"
        disabled={disabled}
        placeholder="00-001"
      />
      <CustomInput
        register={register({
          required: formOnTranslateString('Field required.'),
          validate: (data: any) => validateNip(data) || formOnTranslateString('Invalid NIP.'),
        })}
        errors={errors}
        control={control}
        id="nip"
        disabled={disabled}
        placeholder="NIP"
      />
    </div>
  );
};

export default CompanyDetailsForm;

import React from 'react';
import CustomInput from '../../../../../../components/Common/CustomInput';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { DateInput } from '../../../../../../components/Common';
import { addYears } from 'date-fns';
import styled from 'styled-components';
import { useTenant } from '../../../../../../hooks/useTenant';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { setBirthDate } from '../../../../../../actions/order';

interface Props {
  register: any;
  errors: any;
  control: any;
  disabled?: boolean;
}

const DateInputContainer = styled('div')({
  marginBottom: 20
})

const TenantDetailsForm = ({ register, errors, control, disabled }: Props) => {
  const { tenant } = useTenant();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: ApplicationState) => state.order);

  return (
    <div className="form-field">
      <FormHeader title='application.rentierData' />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        disabled
        id="firstName"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        disabled
        id="lastName"
      />
      {tenant?.birthDateNecessary ? <DateInputContainer>
        <DateInput
          noPadding
          inline={false}
          label='application.birthDate'
          value={formData.birthDate}
          maxDate={addYears(new Date(), -18)}
          onChange={([selected]) => {
            dispatch(setBirthDate(selected));
          }}
          name='birthDate'
        />
      </DateInputContainer> : null}
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
        id="street"
        disabled={disabled}
        placeholder="ul. Główna 12/3"
      />
      <CustomInput
        register={register({ required: formOnTranslateString('Field required.') })}
        errors={errors}
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
        disabled
        id="phone"
      />
    </div>
  );
};

export default TenantDetailsForm;

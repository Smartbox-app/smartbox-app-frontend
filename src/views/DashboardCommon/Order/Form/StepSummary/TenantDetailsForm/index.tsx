import { DateInput } from '../../../../../../components/Common';
import { useTenant } from '../../../../../../hooks/useTenant';
import { Controller, useFormContext } from 'react-hook-form';
import { RentDataDto } from './dto/RentDataDto';
import { Header, Input } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  disabled?: boolean;
}

const TenantDetailsForm = ({ disabled }: Props) => {
  const { tenant } = useTenant();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RentDataDto>();

  return (
    <>
      <Header variant="h2">{__('rent.rentier_data')}</Header>
      <Input
        label="rent.first_name"
        placeholder="rent.first_name_placeholder"
        {...register('firstName')}
        required
        error={errors.firstName?.message}
        disabled
      />
      <Input
        label="rent.last_name"
        placeholder="rent.last_name_placeholder"
        {...register('lastName')}
        required
        error={errors.lastName?.message}
        disabled
      />
      {tenant?.birthDateNecessary ? (
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <DateInput
              {...field}
              required
              inline={false}
              name="birthDate"
              error={errors.birthDate?.message}
              label="rent.birth_date"
              onChange={([selected]) => {
                field.onChange(selected);
              }}
            />
          )}
        />
      ) : null}
      <Input
        label="rent.street"
        {...register('street')}
        required
        error={errors.street?.message}
        disabled={disabled}
        placeholder="rent.street_placeholder"
      />
      <Input
        {...register('city')}
        error={errors.city?.message}
        required
        label="rent.city"
        disabled={disabled}
        placeholder="rent.city_placeholder"
      />
      <Input
        {...register('postCode')}
        error={errors.postCode?.message}
        required
        label="rent.post_code"
        disabled={disabled}
        placeholder="rent.post_code_placeholder"
      />

      <Input
        {...register('mailToSendInvoice')}
        error={errors.mailToSendInvoice?.message}
        disabled
        required
        label="rent.email"
        placeholder="rent.email_placeholder"
      />
      <Input
        label="application.phone"
        {...register('phone')}
        required
        error={errors.phone?.message}
        disabled
        placeholder="rent.phone_placeholder"
      />
    </>
  );
};

export default TenantDetailsForm;

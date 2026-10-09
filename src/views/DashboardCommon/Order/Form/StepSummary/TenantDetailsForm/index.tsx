import countries from 'i18n-iso-countries';
import { subYears } from 'date-fns';
import { DateInput, InputSelect } from '../../../../../../components/Common';
import { useTenant } from '../../../../../../hooks/useTenant';
import { Controller, useFormContext } from 'react-hook-form';
import { RentDataDto } from './dto/RentDataDto';
import { Header, Input } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  disabled?: boolean;
}

const prepareCountries = (): { label: string; value: string }[] => {
  const names = countries.getNames('pl');
  return Object.entries(names)
    .sort((a, b) => (b[1] < a[1] ? 1 : -1))
    .map(([value, label]) => ({ value, label }));
};

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
              allowInput
              name="birthDate"
              error={errors.birthDate?.message}
              label="rent.birth_date"
              maxDate={new Date()}
              minDate={subYears(new Date(), 120)}
              onChange={([selected]: Date[]) => {
                field.onChange(selected);
              }}
            />
          )}
        />
      ) : null}
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState }) => (
          <InputSelect
            name="country"
            label="rent.country"
            placeholder="rent.country_placeholder"
            options={prepareCountries()}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            required
            error={fieldState.error?.message}
          />
        )}
      />
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

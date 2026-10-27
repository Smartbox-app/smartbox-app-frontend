import { Controller, useFormContext } from 'react-hook-form';

import { InputSelect } from 'src/components/Common';
import { Header, Input, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetCountriesList } from 'src/hooks/useGetCountriesList';
import { RentDataDto } from 'src/views/DashboardCommon/Order/Form/StepSummary/TenantDetailsForm/dto/RentDataDto';

interface Props {
  disabled?: boolean;
}

export const CompanyDetailsForm = ({ disabled }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RentDataDto>();

  const countriesList = useGetCountriesList();

  return (
    <Section>
      <Header variant="h2">{__('rent.company_data')}</Header>
      <Controller
        name="companyCountry"
        control={control}
        render={({ field, fieldState }) => (
          <InputSelect
            name="companyCountry"
            label="rent.company_country"
            placeholder="rent.company_country_placeholder"
            options={countriesList}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            required
            error={fieldState.error?.message}
          />
        )}
      />
      <Input
        label="rent.company_name"
        placeholder="rent.company_name_placeholder"
        error={errors.companyName?.message}
        required
        {...register('companyName')}
        disabled={disabled}
      />
      <Input
        label="rent.company_street"
        placeholder="rent.street_placeholder"
        error={errors.companyStreet?.message}
        required
        {...register('companyStreet')}
        disabled={disabled}
      />
      <Input
        label="rent.city"
        placeholder="rent.city_placeholder"
        error={errors.companyCity?.message}
        required
        {...register('companyCity')}
        disabled={disabled}
      />
      <Input
        label="rent.post_code"
        placeholder="rent.post_code_placeholder"
        error={errors.companyPostCode?.message}
        required
        {...register('companyPostCode')}
        disabled={disabled}
      />
      <Input
        label="rent.nip"
        placeholder="rent.nip_placeholder"
        error={errors.nip?.message}
        required
        {...register('nip')}
        disabled={disabled}
        help={__('rent.nip_help')}
      />
    </Section>
  );
};

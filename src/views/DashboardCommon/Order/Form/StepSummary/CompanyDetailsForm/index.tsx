import FormHeader from '../../../../../../components/Layout/FormHeader';
import { useFormContext } from 'react-hook-form';
import { RentDataDto } from '../TenantDetailsForm/dto/RentDataDto';
import { Header, Input, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  disabled?: boolean;
}

export const CompanyDetailsForm = ({ disabled }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RentDataDto>();

  return (
    <Section>
      <Header variant="h2">{__('rent.company_data')}</Header>
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
      />
    </Section>
  );
};

import { useFormContext } from 'react-hook-form';

import { Header, Input, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { RentDataDto } from '../TenantDetailsForm/dto/RentDataDto';

export const ClientSourceForm = () => {
  const { getText } = useTenantNaming();

  const {
    register,
    formState: { errors },
  } = useFormContext<RentDataDto>();

  return (
    <Section>
      <Input
        label={getText('client_source')}
        placeholder={getText('client_source_placeholder')}
        {...register('clientSource')}
        error={errors.clientSource?.message}
      />
    </Section>
  );
};

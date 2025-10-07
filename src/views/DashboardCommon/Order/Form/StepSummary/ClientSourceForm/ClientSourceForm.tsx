import { useFormContext } from 'react-hook-form';

import { Header, Input, Section, Select } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { RentDataDto } from '../TenantDetailsForm/dto/RentDataDto';
import { InputSelect } from 'src/components/Common';

export const ClientSourceForm = () => {
  const { getText } = useTenantNaming();

  const {
    register,
    formState: { errors },
  } = useFormContext<RentDataDto>();

  return (
    <Section>
      <Select
        label={getText('client_source')}
        placeholder={getText('client_source_placeholder')}
        {...register('clientSource')}
        options={[
          {
            label: 'Zobaczyłem Was przejeżdżając obok',
            value: 'Zobaczyłem Was przejeżdżając obok',
          },
          {
            label: 'Ulotka',
            value: 'Ulotka',
          },
          {
            label: 'Baner zewnętrzny',
            value: 'Baner zewnętrzny',
          },
          {
            label: 'Media społecznościowe (Facebook, Instagram, Tiktok, inne)',
            value: 'Media społecznościowe (Facebook, Instagram, Tiktok, inne)',
          },
          {
            label: 'Google (inna wyszukiwarka)',
            value: 'Google (inna wyszukiwarka)',
          },
          {
            label: 'Ogłoszenie internetowe (OLX, inne)',
            value: 'Ogłoszenie internetowe (OLX, inne)',
          },
          {
            label: 'Inne',
            value: 'Inne',
          },
        ]}
        error={errors.clientSource?.message}
      />
    </Section>
  );
};

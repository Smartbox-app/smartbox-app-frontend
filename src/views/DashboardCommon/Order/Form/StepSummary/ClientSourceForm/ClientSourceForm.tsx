import { Controller, useFormContext } from 'react-hook-form';
import { InputSelect } from 'src/components/Common';
import { Section } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { RentDataDto } from '../TenantDetailsForm/dto/RentDataDto';

const clientSourceOptions = [
  {
    label: 'Zobaczyłem Was przejeżdżając obok',
    value: 'Zobaczyłem Was przejeżdżając obok',
  },
  { label: 'Ulotka', value: 'Ulotka' },
  { label: 'Baner zewnętrzny', value: 'Baner zewnętrzny' },
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
  { label: 'Polecenie od znajomego', value: 'Polecenie od znajomego' },
  { label: 'AI (ChatGPT, Claude, Gemini itp.)', value: 'AI (ChatGPT, Claude, Gemini itp.)' },
  { label: 'Radio', value: 'Radio' },
  { label: 'Inne', value: 'Inne' },
];

export const ClientSourceForm = () => {
  const { getText } = useTenantNaming();
  const { control } = useFormContext<RentDataDto>();

  return (
    <Section>
      <Controller
        name="clientSource"
        control={control}
        render={({ field, fieldState }) => (
          <InputSelect
            name="clientSource"
            label={getText('client_source')}
            placeholder={getText('client_source_placeholder')}
            options={clientSourceOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            required
            error={fieldState.error?.message}
          />
        )}
      />
    </Section>
  );
};

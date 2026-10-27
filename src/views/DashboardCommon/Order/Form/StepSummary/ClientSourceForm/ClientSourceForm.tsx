import { Controller, useFormContext } from 'react-hook-form';

import { InputSelect } from 'src/components/Common';
import { Section } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { RentDataDto } from 'src/views/DashboardCommon/Order/Form/StepSummary/TenantDetailsForm/dto/RentDataDto';

const clientSourceOptions = [
  {
    label: 'application.phrases.clientSourceDroveBy',
    value: 'Zobaczyłem Was przejeżdżając obok',
  },
  { label: 'application.phrases.clientSourceFlyer', value: 'Ulotka' },
  {
    label: 'application.phrases.clientSourceBanner',
    value: 'Baner zewnętrzny',
  },
  {
    label: 'application.phrases.clientSourceSocial',
    value: 'Media społecznościowe (Facebook, Instagram, Tiktok, inne)',
  },
  {
    label: 'application.phrases.clientSourceGoogle',
    value: 'Google (inna wyszukiwarka)',
  },
  {
    label: 'application.phrases.clientSourceListing',
    value: 'Ogłoszenie internetowe (OLX, inne)',
  },
  {
    label: 'application.phrases.clientSourceReferral',
    value: 'Polecenie od znajomego',
  },
  {
    label: 'application.phrases.clientSourceAi',
    value: 'AI (ChatGPT, Claude, Gemini itp.)',
  },
  { label: 'application.phrases.clientSourceRadio', value: 'Radio' },
  { label: 'application.phrases.clientSourceOther', value: 'Inne' },
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

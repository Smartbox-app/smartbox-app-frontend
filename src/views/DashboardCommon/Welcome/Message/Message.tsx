import { Alert } from 'src/components/Common';
import { Section } from 'src/components/ui';
import { useTenant } from 'src/hooks/useTenant';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';

export const Message = () => {
  const { tenant } = useTenant();

  if (!tenant?.homeMessage) return null;

  return (
    <Section>
      <Alert type="notice">{textToSimpleMD(tenant.homeMessage)}</Alert>
    </Section>
  );
};

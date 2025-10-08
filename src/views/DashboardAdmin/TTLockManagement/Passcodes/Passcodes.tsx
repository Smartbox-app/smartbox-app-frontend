import { useParams } from 'react-router';
import { lockPasscodesList } from 'smartbox-tables';
import { ApiTable } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';


export const Passcodes = () => {
  const { lockId } = useParams<{ lockId?: string }>();
 
  const scheme = new InteractiveTableSchema(lockPasscodesList );

  return (
    <Section>
      <Header variant="h2">{__('application.lockPasscodes')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl={`driver/locks/${lockId}/passcodes`} />
    </Section>
  );
};

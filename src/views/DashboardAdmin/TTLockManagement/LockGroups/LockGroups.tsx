import { lockGroupsList } from 'smartbox-tables';
import { TTLockGroup } from 'smartbox-types';
import { history } from 'src/history';
import { ApiTable } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const LockGroups = () => {
  const scheme = new InteractiveTableSchema(lockGroupsList);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.seeLocksFromGroup',
        type: 'success',
        click: (data: TTLockGroup) =>
          history.push(`/admin/drivers/locks/group/${data.groupId}`),
      },
    ],
  });

  return (
    <Section>
      <Header variant="h2">{__('application.lockGroups')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl="driver/groups/" />
    </Section>
  );
};

import { useDispatch } from 'react-redux';
import { TTLockDeviceList } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { ApiTable } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { locksList } from 'src/smartbox-tables/schemas/locks-list.table';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const Locks = () => {
  const dispatch = useDispatch();

  const scheme = new InteractiveTableSchema(locksList);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.unlock',
        type: 'success',
        click: (data: TTLockDeviceList) => openLock(data),
      },
    ],
  });

  const openLock = async (data: TTLockDeviceList) => {
    await ApiService.callFetch('PATCH', `driver/open/${data.lockId}`, () => {
      dispatch(successNotification('application.lockOpened'));
    });
  };

  return (
    <Section>
      <Header variant="h2">{__('application.locks')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl={`driver/ttlock`} />
    </Section>
  );
};

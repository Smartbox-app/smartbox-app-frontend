import { FieldType, gatewayList } from 'smartbox-tables';
import { TTLockGateway } from 'smartbox-types';
import { Alert, ApiTable } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const Gateways = () => {
  const scheme = new InteractiveTableSchema(gatewayList);

  scheme
    .modifyFieldStatic('isOnline', {
      name: __('application.isOnline'),
      field: 'pricing',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, gateway: TTLockGateway) =>
        gateway.isOnline ? (
          <Alert compact type="success" text="application.yes" />
        ) : (
          <Alert compact type="error" text="application.no" />
        ),
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.seeLocksFromGateway',
          type: 'success',
          click: (data: TTLockGateway) =>
            history.push(`/admin/drivers/locks/gateway/${data.gatewayId}`),
        },
      ],
    });

  return (
    <Section>
      <Header variant="h2">{__('application.gateways')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl="driver/gateways" />
    </Section>
  );
};

import React from 'react';
import { TableSchema, usersList } from 'smartbox-tables';
import { PageHeader, Section, ButtonsContainer } from '../../../../../components/Layout';
import { ApiTable, Button } from '../../../../../components/Common';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';

interface Props {}

class List extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(usersList).addFieldAtTheEnd({
      name: 'Akcje',
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: __('application.edit'),
          type: 'primary',
          click: (data: any) => console.log(data.id),
        },
        {
          name: __('application.delete'),
          type: 'danger',
          click: (data: any) => console.log(data.id),
        },
      ],
    });
  }

  render() {
    return (
      <Section full>
        <PageHeader title={__('application.workersList')} />
        <ButtonsContainer>
          <Button text={__('application.inviteWorker')} primary to="/admin/management/workers/add" />
        </ButtonsContainer>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="user/list" />
      </Section>
    );
  }
}

export default List;

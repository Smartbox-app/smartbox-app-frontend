import React from 'react';
import { invitationList, TableSchema, usersList } from 'smartbox-tables';
import { PageHeader, Section, ButtonsContainer } from '../../../../../components/Layout';
import { ApiTable, Button } from '../../../../../components/Common';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';

interface Props {}

class InvitesSent extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(invitationList).addFieldAtTheEnd({
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
        <PageHeader title={__('application.usersList')} />
        <ButtonsContainer>
          <Button text={__('application.back')} primary to="/admin/management/workers/list" />
        </ButtonsContainer>
        <h2>Lista wysłanych zaproszeń</h2>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="user/invitation-list" />
      </Section>
    );
  }
}

export default InvitesSent;

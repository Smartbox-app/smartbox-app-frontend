import React from 'react';
import { TableSchema, usersList } from 'smartbox-tables';
import { PageHeader, Section } from '../../../../components/Layout';
import { ApiTable } from '../../../../components/Common';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';

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
          name: 'Pokaż szczegoły',
          type: 'primary',
          click: (data: any) => console.log(data.id),
        },
      ],
    });
  }

  render() {
    return (
      <Section full>
        <PageHeader title="Lista pracowników" />
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="user/list" />
      </Section>
    );
  }
}

export default List;

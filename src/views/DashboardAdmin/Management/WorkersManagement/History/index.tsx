import React from 'react';
import { TableSchema, WorkerStatusTable } from 'smartbox-tables';
import { ApiTable, Button } from '../../../../../components/Common';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';
import { ButtonsContainer, PageHeader, Section } from '../../../../../components/Layout';

interface Props {}

class History extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(WorkerStatusTable);
  }

  render() {
    return (
      <Section full>
        <PageHeader title={__('application.historyWorker')} />
        <ButtonsContainer>
          <Button text={__('application.back')} primary to="/admin/management/workers/list" />
        </ButtonsContainer>
        <ApiTable
          scheme={this.scheme}
          apiEndpointSubUrl="rent/changes-story/worker/07b76069-5bbc-4486-95b4-63ea8a7eba52"
        />
      </Section>
    );
  }
}

export default History;

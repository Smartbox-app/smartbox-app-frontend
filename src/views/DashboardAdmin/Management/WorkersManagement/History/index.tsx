import React from 'react';
import { connect } from 'react-redux';
import { TableSchema, WorkerStatusTable } from 'smartbox-tables';
import { StockList, UserRes } from 'smartbox-types';
import { ApiTable, Button, Spinner } from '../../../../../components/Common';
import { ApplicationState } from '../../../../../reducers';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';
import { ButtonsContainer, PageHeader, Section } from '../../../../../components/Layout';

interface Props {
  stockId: Omit<StockList, 'getProps'>;
  user: UserRes;
}

class History extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(WorkerStatusTable);
  }

  render() {
    const { stockId } = this.props;
    return (
      <Section full>
        <PageHeader title={__('application.historyWorker')} />
        <ButtonsContainer>
          <Button text={__('application.back')} primary to="/admin/management/workers/list" />
        </ButtonsContainer>

        {stockId?.id ? (
          <ApiTable scheme={this.scheme} apiEndpointSubUrl={`rent/changes-story/worker/${stockId.id}`} />
        ) : (
          <Spinner />
        )}
      </Section>
    );
  }
}
const mapStateToProps = (state: ApplicationState) => ({
  stockId: state.stock.list[0],
  user: state.user.details,
});

export default connect(mapStateToProps)(History);

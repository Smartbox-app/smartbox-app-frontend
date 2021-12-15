import React from 'react';
import { connect } from 'react-redux';
import { StockStatusTable, TableSchema } from 'smartbox-tables';
import { StockList, UserRes } from 'smartbox-types';
import { ApiTable, Button, Spinner } from '../../../../../components/Common';
import { ApplicationState } from '../../../../../reducers';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { ButtonsContainer, PageHeader, Section, SectionHeader } from '../../../../../components/Layout';

interface Props {
  stockId: Omit<StockList, 'getProps'>;
  user: UserRes;
}

class History extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(StockStatusTable);
  }

  render() {
    const { stockId } = this.props;
    return (
      <Section full>
        <PageHeader title='application.historyWorker' />
        <ButtonsContainer>
          <Button text='application.back' primary to="/admin/management/workers/list" />
        </ButtonsContainer>
        {stockId?.id ? (
          <>
            <SectionHeader title={stockId.name} />
            <ApiTable scheme={this.scheme} apiEndpointSubUrl={`rent/changes-story/stock/${stockId.id}`} />
          </>
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

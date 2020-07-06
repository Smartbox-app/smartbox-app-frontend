import React from 'react';
import { TableSchema, discounTable } from 'smartbox-tables';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Section, ButtonsContainer } from '../../../../../components/Layout';
import { ApiTable, Button, ConfirmModal } from '../../../../../components/Common';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';
import { modal, sales } from '../../../../../actions';

interface Props {
  showModal: (content: React.ReactNode) => void;
  fetchSingleBoxDetails: (discoutnId: string) => void;
}

class List extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(discounTable).addFieldAtTheEnd({
      name: 'Akcje',
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: __('application.edit'),
          type: 'primary',
          click: (data: any) => console.log(data),
        },
        {
          name: __('application.delete'),
          type: 'danger',
          click: (data: any) =>
            this.props.showModal(
              <ConfirmModal
                mainText={__('application.deleteSingleSale')}
                aproveButtonText={__('application.delete')}
                approveAction={() => this.props.fetchSingleBoxDetails(data.stockId)}
              />,
            ),
        },
      ],
    });
  }

  render() {
    return (
      <Section full>
        <PageHeader title={__('application.salesList')} />
        <ButtonsContainer>
          <Button text={__('application.createSale')} primary to="/admin/management/stock-discount/add" />
        </ButtonsContainer>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="stock/discount/list" />
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...sales,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(List);

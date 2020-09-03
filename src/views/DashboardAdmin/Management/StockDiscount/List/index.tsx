import React from 'react';
import { TableSchema, discounTable } from 'smartbox-tables';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Section, ButtonsContainer } from '../../../../../components/Layout';
import { ApiTable, Button, ConfirmModal } from '../../../../../components/Common';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';
import { modal, stock } from '../../../../../actions';

import Edit from '../Edit';
import Add from '../Add';

interface Props {
  showModal: (content: React.ReactNode) => void;
  deleteStockDiscount: (discountId: string) => void;
}

class List extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    const { showModal, deleteStockDiscount } = this.props;
    this.scheme = new InteractiveTableSchema(discounTable).addFieldAtTheEnd({
      name: 'Akcje',
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: __('application.edit'),
          type: 'primary',
          click: (data: any) => showModal(<Edit discoutnId={data.stockId} />),
        },
        {
          name: __('application.delete'),
          type: 'danger',
          click: (data: any) =>
            showModal(
              <ConfirmModal
                aproveButtonText={__('application.delete')}
                mainText={__('application.deleteSingleSale')}
                // approveAction={() => deleteStockDiscount(data.stockId)}
                approveAction={() => console.log(data)}
              />,
            ),
        },
      ],
    });
  }

  render() {
    const { showModal } = this.props;
    return (
      <Section full>
        <ButtonsContainer>
          <Button text={__('application.createStockDisc')} primary click={() => showModal(<Add />)} />
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
      ...stock,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(List);

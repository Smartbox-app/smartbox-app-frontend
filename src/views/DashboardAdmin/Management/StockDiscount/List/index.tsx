import React from 'react';
import { TableSchema, discounTable } from 'smartbox-tables';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Section, ButtonsContainer } from '../../../../../components/Layout';
import { ApiTable, Button, ConfirmModal } from '../../../../../components/Common';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { __ } from '../../../../../helpers/i18n';
import { modal, stock } from '../../../../../actions';
import DiscountCodes from '../../DiscountCodes';

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
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: __('application.edit'),
          type: 'primary',
          click: (data: any) => showModal(<Edit discountId={data.discountId} />),
        },
        {
          name: __('application.delete'),
          type: 'danger',
          click: (data: any) =>
            showModal(
              <ConfirmModal
                approveButtonText={__('application.delete')}
                mainText={__('application.deleteSingleSale')}
                approveAction={() => deleteStockDiscount(data.discountId)}
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
          <Button text='application.createDiscountCode' primary click={() => showModal(<DiscountCodes />)} />
          <Button text='application.createStockDisc' primary click={() => showModal(<Add />)} />
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

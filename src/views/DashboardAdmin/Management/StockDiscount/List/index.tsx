import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TableSchema, discounTable } from 'smartbox-tables';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { ApiTable, Button, ConfirmModal } from '../../../../../components/Common';
import { ButtonsContainer } from '../../../../../components/Layout';
import { modal } from '../../../../../actions';
import Edit from '../Edit';
import Add from '../Add';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

class List extends Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    const { showModal } = this.props;
    this.scheme = new InteractiveTableSchema(discounTable).addFieldAtTheEnd({
      name: 'Akcje',
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: __('application.edit'),
          type: 'primary',
          click: (data: any) => showModal(<Edit key={data.stockId} />),
        },
        {
          name: __('application.delete'),
          type: 'danger',
          click: (data: any) =>
            showModal(
              <ConfirmModal aproveButtonText={__('application.delete')} mainText="Czy" approveAction={() => {}} />,
            ),
        },
      ],
    });
  }

  render() {
    const { showModal } = this.props;
    return (
      <>
        <ButtonsContainer>
          <Button text={__('application.createStockDisc')} primary click={() => showModal(<Add />)} />
        </ButtonsContainer>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="stock/discount/list" />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(List);

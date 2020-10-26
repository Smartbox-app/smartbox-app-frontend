import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, usersList } from 'smartbox-tables';
import { IUser, UserStatus } from 'smartbox-types';
import { ApiTable, Button, ConfirmModal } from '../../../../../components/Common';
import { ButtonsContainer, PageHeader, Section } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { modal, user } from '../../../../../actions';

interface Props {
  showModal: (content: React.ReactNode) => void;
  enableUser: (userId: string) => void;
  blockUser: (userId: string) => void;
}

class List extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(usersList)
      .removeFields('status')
      .addFieldAfter('role', {
        name: __('application.state'),
        field: 'status',
        mobile: true,
        type: FieldType.Custom,
        customRender: (value, field, userData) => this.getLockButton(value, field, userData),
      })
      .addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
          {
            name: __('application.delete'),
            type: 'danger',
            click: (data: any) =>
              this.props.showModal(
                <ConfirmModal
                  approveButtonText={__('application.delete')}
                  mainText="Czy jesteś pewien, że chcesz usunąć użytkownika"
                  cancelButtonText={__('application.cancel')}
                  approveAction={() => console.log()}
                />,
              ),
          },
        ],
      });
  }

  private getLockButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
    if (userData.status === UserStatus.blocked) {
      return <Button text={__('application.active')} success small click={() => this.props.enableUser(userData.id)} />;
    } else {
      return <Button text={__('application.block')} danger small click={() => this.props.blockUser(userData.id)} />;
    }
  };

  render() {
    return (
      <Section full>
        <PageHeader title={__('application.usersList')} />
        <ButtonsContainer>
          <Button text={__('application.inviteUser')} primary to="/admin/management/workers/add" />
          <Button text={__('application.historyWorker')} primary to="/admin/management/workers/history" />
        </ButtonsContainer>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="user/list" />
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(List);

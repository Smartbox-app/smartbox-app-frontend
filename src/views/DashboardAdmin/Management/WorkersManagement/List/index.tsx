import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, usersList } from 'smartbox-tables';
import { IUser, UserRes, UserRole, UserStatus } from 'smartbox-types';
import { ApiTable, Button, ConfirmModal } from '../../../../../components/Common';
import { ButtonsContainer, PageHeader, Section } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { modal } from '../../../../../actions';
import EditAssign from './EditAssign';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

class List extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(usersList)
      .removeFields('status')
      .addFieldAfter('role', {
        name: 'Przypisanie',
        field: 'storageAssign',
        mobile: true,
        type: FieldType.Custom,
        customRender: (value, field, userData) => this.getAssignButton(value, field, userData),
      })
      .addFieldAfter('storageAssign', {
        name: 'Status',
        field: 'status',
        mobile: true,
        type: FieldType.Custom,
        customRender: (value, field, userData) => this.getLockButton(value, field, userData),
      })
      .addFieldAtTheEnd({
        name: 'Akcje',
        field: 'actions',
        mobile: true,
        buttons: [
          {
            name: __('application.delete'),
            type: 'danger',
            click: (data: any) =>
              this.props.showModal(
                <ConfirmModal
                  aproveButtonText={__('application.delete')}
                  mainText="Czy jesteś pewien, że chcesz usunąć użytkownika"
                  cancelButtonText={__('application.cancel')}
                  approveAction={() => console.log()}
                />,
              ),
          },
        ],
      });
  }

  private getAssignButton = (value: any, field: TableSchemaField, userData: IUser) => {
    if (userData.role === UserRole.worker) {
      return (
        <Button
          text="Zmień przypisanie"
          primary
          click={() => this.props.showModal(<EditAssign userId={userData.id} />)}
        />
      );
    } else {
      return 'nie dotyczy';
    }
  };

  private getLockButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
    if (userData.status === UserStatus.blocked) {
      return <Button text={__('application.active')} success small click={() => console.log(userData)} />;
    } else {
      return <Button text={__('application.block')} danger small click={() => console.log(userData)} />;
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

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(List);

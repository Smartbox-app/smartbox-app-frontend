import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, usersList } from 'smartbox-tables';
import { IUser, UserStatus, UserType } from 'smartbox-types';
import { ApiTable } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer, PageHeader, Section } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { modal, user } from '../../../../actions';
import { isWorker } from '../../../../utils/role-check';

import EditAssign from './EditAssign';
import EditRoleForm from './EditRoleForm';

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
      .modifyFieldStatic('status', {
        name: __('application.state'),
        field: 'status',
        mobile: true,
        defaultSort: true,
        type: FieldType.Custom,
        customRender: (value, field, userData) => this.getLockButton(value, field, userData),
      })
      .addFieldAfter('role', {
        name: __('application.userAssigment'),
        field: 'storageAssign',
        mobile: true,
        type: FieldType.Custom,
        sortable: true,
        customRender: (value, field, userData) => this.getAssignButton(value, field, userData),
      })
      .addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
          {
            name: 'application.changeUserRole',
            type: 'primary',
            click: (data: any) => this.props.showModal(<EditRoleForm userId={data.id} />),
          },
        ],
      });
  }

  private getAssignButton = (value: any, field: TableSchemaField, userData: IUser) => {
    if (isWorker(userData.role)) {
      return (
        <ButtonsContainer max>
          <Button
            text='application.change'
            primary
            click={() => this.props.showModal(<EditAssign userId={userData.id} />)}
          />
        </ButtonsContainer>
      );
    } else {
      return __('application.notApplicable');
    }
  };

  private getLockButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
    if (userData.status === UserStatus.blocked) {
      return (
        <ButtonsContainer max>
          <Button text='application.active' success click={() => this.props.enableUser(userData.id)} />
        </ButtonsContainer>
      );
    } else {
      return (
        <ButtonsContainer max>
          <Button text='application.block' danger click={() => this.props.blockUser(userData.id)} />
        </ButtonsContainer>
      );
    }
  };

  render() {
    return (
      <Section full>
        <PageHeader title='application.workersList' />
        <ButtonsContainer>
          <Button text='application.inviteUser' primary to="/admin/management/workers/add" />
          <Button text='application.historyWorker' primary to="/admin/management/workers/history" />
        </ButtonsContainer>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl={`user/list/${UserType.staff}`} />
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(List);

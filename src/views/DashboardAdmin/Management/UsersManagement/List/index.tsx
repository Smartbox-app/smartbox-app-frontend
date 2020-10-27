import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, usersList } from 'smartbox-tables';
import { IUser, UserStatus, UserType } from 'smartbox-types';
import { ApiTable, Button } from '../../../../../components/Common';
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
    this.scheme = new InteractiveTableSchema(usersList).modifyFieldStatic('status', {
      name: __('application.state'),
      field: 'status',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, userData) => this.getLockButton(value, field, userData),
    });
  }

  private getLockButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
    if (userData.status === UserStatus.blocked) {
      return <Button text={__('application.active')} success click={() => this.props.enableUser(userData.id)} />;
    } else {
      return <Button text={__('application.block')} danger click={() => this.props.blockUser(userData.id)} />;
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
        <ApiTable scheme={this.scheme} apiEndpointSubUrl={`user/list/${UserType.client}`} />
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(List);

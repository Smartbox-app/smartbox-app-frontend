import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, type AnyAction, type Dispatch } from 'redux';
import {
  FieldType,
  TableSchema,
  TableSchemaField,
  tenantsList,
} from 'smartbox-tables';
import { UserClientListRes, UserStatus } from 'smartbox-types';
import { ApiTable } from '../../../../../components/Common';
import { Button } from '../../../../../components/Branded';
import { ButtonsContainer } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { modal, user } from '../../../../../actions';
import { TenantStatus } from '../Status';
import { HeaderWithActions, Section } from 'src/components/ui';
import { history } from 'src/history';

interface Props {
  showModal: (content: React.ReactNode) => void;
  enableUser: (userId: string) => void;
  blockUser: (userId: string) => void;
}

class List extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(tenantsList)
      .modifyFieldStatic('status', {
        name: __('application.state'),
        field: 'status',
        mobile: true,
        defaultSort: true,
        type: FieldType.Custom,
        customRender: (value, field, userData: UserClientListRes) =>
          this.getLockButton(value, field, userData),
      })
      // .addFieldAfter('phone', {
      //     name: __('application.stockDetails'),
      //     field: 'stocks',
      //     mobile: true,
      //     type: FieldType.Custom,
      //     customRender: (value, field, userData: UserClientListRes) => <StocksDetails user={userData} />
      // })
      .addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
          {
            name: 'application.settings',
            type: 'primary',
            click: (data: UserClientListRes) =>
              history.push(
                `/admin/management/clients/${data.id}/${data.tenantId}/settings`,
              ),
          },
          {
            name: 'application.status',
            type: 'secondary',
            click: (data: UserClientListRes) =>
              this.props.showModal(
                <TenantStatus tenantId={data.tenantId!} user={data} />,
              ),
          },
        ],
      });
  }

  private getLockButton = (
    _value: unknown,
    field: TableSchemaField,
    userData: UserClientListRes,
  ) => {
    if ([UserStatus.blocked, UserStatus.preActive].includes(userData.status)) {
      return (
        <Button
          text="application.active"
          success
          click={() => this.props.enableUser(userData.id)}
        />
      );
    } 
      return (
        <Button
          text="application.block"
          danger
          click={() => this.props.blockUser(userData.id)}
        />
      );
    
  };

  render() {
    return (
      <Section>
        <HeaderWithActions
          actions={
            <ButtonsContainer>
              <Button
                text="application.addTenant"
                primary
                to="/admin/management/clients/add"
              />
            </ButtonsContainer>
          }
        >
          {__('application.tenantsList')}
        </HeaderWithActions>

        <ApiTable scheme={this.scheme} apiEndpointSubUrl="user/tenants" />
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(List);

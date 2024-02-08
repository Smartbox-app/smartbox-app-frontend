import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, tenantsList } from 'smartbox-tables';
import { IUser, UserClientListRes, UserListRes, UserStatus, UserType } from 'smartbox-types';
import { ApiTable } from '../../../../../components/Common';
import { Button } from '../../../../../components/Branded';
import { ButtonsContainer, PageHeader, Section } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { modal, user } from '../../../../../actions';
import UserDetail from './UserDetail';
import { TenantEdit } from '../Edit';
import { StocksDetails } from './StocksDetails';
import { TenantStatus } from '../Status';

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
                customRender: (value, field, userData) => this.getLockButton(value, field, userData),
            })
            .addFieldAfter('phone', {
                name: __('application.stockDetails'),
                field: 'stocks',
                mobile: true,
                type: FieldType.Custom,
                customRender: (value, field, userData: UserClientListRes) => <StocksDetails user={userData} />
            })
            .addFieldAtTheEnd({
                name: __('application.actions'),
                field: 'actions',
                mobile: true,
                buttons: [
                    // {
                    //     name: 'application.userDetails',
                    //     type: 'primary',
                    //     click: (data: UserListRes) => this.props.showModal(<UserDetail userId={data.id} userData={data} />),
                    // },
                    {
                        name: 'application.edit',
                        type: 'primary',
                        click: (data: UserListRes) => this.props.showModal(<TenantEdit userId={data.id} />),
                    },
                    {
                        name: 'application.status',
                        type: 'secondary',
                        click: (data: UserListRes) => this.props.showModal(<TenantStatus tenantId={data.tenantId!} />),
                    },
                ],
            });
    }

    private getLockButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
        if (userData.status === UserStatus.blocked) {
            return <Button text='application.active' success click={() => this.props.enableUser(userData.id)} />;
        } else {
            return <Button text='application.block' danger click={() => this.props.blockUser(userData.id)} />;
        }
    };

    render() {
        return (
            <Section full>
                <PageHeader title='application.tenantsList' />
                <ButtonsContainer>
                    <Button text='application.addTenant' primary to="/admin/management/clients/add" />        </ButtonsContainer>
                <ApiTable scheme={this.scheme} apiEndpointSubUrl={`user/tenants`} />
            </Section>
        );
    }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(List);

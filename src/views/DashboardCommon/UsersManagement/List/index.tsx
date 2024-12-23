import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, usersList, usersListForAdmin } from 'smartbox-tables';
import { IUser, UserListRes, UserRes, UserRole, UserStatus, UserType } from 'smartbox-types';
import { ApiTable, ConfirmModal } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer, PageHeader, Section } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { modal, user } from '../../../../actions';
import UserDetail from './UserDetail';
import UserEdit from "./UserEdit";
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';

interface Props {
    user: UserRes;
    showModal: (content: React.ReactNode) => void;
    enableUser: (userId: string) => void;
    blockUser: (userId: string) => void;
    deleteUser: (userId: string) => void;
    deleteUserByForce: (userId: string) => void;
}

class List extends React.Component<Props> {
    private scheme: TableSchema;

    constructor(props: Props) {
        super(props);
        this.scheme = new InteractiveTableSchema(this.props.user.role === UserRole.admin ? usersListForAdmin : usersList)
            .modifyFieldStatic('status', {
                name: __('application.state'),
                field: 'status',
                mobile: true,
                defaultSort: true,
                type: FieldType.Custom,
                customRender: (value, field, userData) => this.getLockButton(value, field, userData),
            })
            .removeFields('role')
            .addFieldAtTheEnd({
                name: __('application.actions'),
                field: 'actions',
                mobile: true,
                type: FieldType.Custom,
                customRender: (value, field, userData: UserListRes) => {
                    return <>
                        <Button primary text='application.userDetails' click={(data: UserListRes) => this.props.showModal(<UserDetail userId={data.id} userData={userData} />)} />
                        <Button secondary text='application.edit' click={(data: UserListRes) => this.props.showModal(<UserEdit userId={userData.id} />)} />
                        <Button danger text='application.delete' click={(data: UserListRes) => this.confirmUserDelete(userData.id)} />
                        {this.props.user.role === UserRole.admin ? <Button danger text='application.deleteByForce' click={(data: UserListRes) => this.confirmUserDeleteByForce(userData.id)} /> : null}
                    </>
                }
                // buttons: [
                //     {
                //         name: 'application.userDetails',
                //         type: 'primary',
                //         click: (data: UserListRes) => this.props.showModal(<UserDetail userId={data.id} userData={data} />),
                //     },
                //     {
                //         name: 'application.edit',
                //         type: 'secondary',
                //         click: (data: UserListRes) => this.props.showModal(<UserEdit userId={data.id} />),
                //     },
                // ],
            });
    }

    private confirmUserDelete = (userId: string) => {
        this.props.showModal(<ConfirmModal
            approveButtonText='application.delete'
            mainText='application.deleteUserText'
            approveAction={() => this.props.deleteUser(userId)}
        />)
    }

    private confirmUserDeleteByForce = (userId: string) => {
        this.props.showModal(<ConfirmModal
            approveButtonText='application.delete'
            mainText='application.deleteUserText'
            approveAction={() => this.props.deleteUserByForce(userId)}
        />)
    }

    private getLockButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
        if ([UserStatus.blocked, UserStatus.preActive].includes(userData.status)) {
            return <Button text='application.active' success click={() => this.props.enableUser(userData.id)} />;
        } else {
            return <Button text='application.block' danger click={() => this.props.blockUser(userData.id)} />;
        }
    };

    private getDeleteButton = (value: boolean, field: TableSchemaField, userData: IUser) => {
        if ([UserStatus.blocked, UserStatus.preActive].includes(userData.status)) {
            return <Button text='application.active' success click={() => this.props.enableUser(userData.id)} />;
        } else {
            return <Button text='application.block' danger click={() => this.props.blockUser(userData.id)} />;
        }
    };

    render() {
        const { user } = this.props;
        return (
            <Section full>
                <PageHeader title='application.usersList' />
                <ButtonsContainer>
                    <Button text='application.inviteUser' primary to={`/${UserService.getSlugByRole(user.role)}/management/users/add`} />
                    <Button text='application.historyWorker' secondary to={`/${UserService.getSlugByRole(user.role)}/management/workers/history`} />
                </ButtonsContainer>
                <ApiTable scheme={this.scheme} apiEndpointSubUrl={`user/list/${UserType.user}`} />
            </Section>
        );
    }
}


const mapStateToProps = (state: ApplicationState) => ({
    user: state.user.details!,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(List);

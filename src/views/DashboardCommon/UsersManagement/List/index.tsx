import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldType, TableSchema, TableSchemaField, usersList } from 'smartbox-tables';
import { IUser, UserListRes, UserRes, UserStatus, UserType } from 'smartbox-types';
import { ApiTable } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer, PageHeader, Section } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { modal, user } from '../../../../actions';
import UserDetail from './UserDetail';
import UserEdit from "./UserEdit";
import { ApplicationState } from 'src/reducers';
import UserService from '../../../../services/user-service';

interface Props {
    user: UserRes;
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
            .removeFields('role')
            .addFieldAtTheEnd({
                name: __('application.actions'),
                field: 'actions',
                mobile: true,
                buttons: [
                    {
                        name: 'application.userDetails',
                        type: 'primary',
                        click: (data: UserListRes) => this.props.showModal(<UserDetail userId={data.id} userData={data} />),
                    },
                    {
                        name: 'application.edit',
                        type: 'primary',
                        click: (data: UserListRes) => this.props.showModal(<UserEdit userId={data.id} />),
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
        const { user } = this.props;
        return (
            <Section full>
                <PageHeader title='application.usersList' />
                <ButtonsContainer>
                    <Button text='application.inviteUser' primary to={`/${UserService.getSlugByRole(user.role)}/management/users/add`} />
                    <Button text='application.historyWorker' primary to={`/${UserService.getSlugByRole(user.role)}/management/workers/history`} />
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

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { invitationList, TableSchema } from 'smartbox-tables';
import { PageHeader, Section, ButtonsContainer } from '../../../../components/Layout';
import { ApiTable, Button, ConfirmModal } from '../../../../components/Common';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { __ } from '../../../../helpers/i18n';
import { invitations, modal } from '../../../../actions';

interface Props {
  deleteSentInvitations: (invitationId: string) => void;
  resendInvitations: (invitationId: string) => void;
  showModal: (content: React.ReactNode) => void;
}

class InvitesSent extends React.Component<Props> {
  private scheme: TableSchema;

  constructor(props: Props) {
    super(props);
    this.scheme = new InteractiveTableSchema(invitationList).addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.resend',
          type: 'primary',
          click: (data: any) => this.props.resendInvitations(data.id),
        },
        {
          name: 'application.delete',
          type: 'danger',
          click: (data: any) =>
            this.props.showModal(
              <ConfirmModal
                approveButtonText='application.delete'
                mainText='application.doYouWantDeleteInvite'
                cancelButtonText='application.cancel'
                approveAction={() => this.props.deleteSentInvitations(data.id)}
              />,
            ),
        },
      ],
    });
  }

  render() {
    return (
      <Section full>
        <PageHeader title='application.inviteList' />
        <ButtonsContainer>
          <Button text='application.inviteUser' primary to="/admin/management/workers/add" />
        </ButtonsContainer>
        <ApiTable scheme={this.scheme} apiEndpointSubUrl="user/invitation-list" />
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...invitations, ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(InvitesSent);

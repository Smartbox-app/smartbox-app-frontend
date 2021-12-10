import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { PageHeader, ButtonsContainer, FormContainer } from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { notifications } from '../../../../actions';
import { history } from '../../../../App';
import { __ } from '../../../../helpers/i18n';

interface Props {
  successNotification: (text: string) => void;
}

const Add = ({ successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text='application.sendInvitation' type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/invite-worker';
  const sendUrl = 'user/invite-user';

  return (
    <>
      <PageHeader title='application.preInvitation' />
      <ButtonsContainer>
        <Button to="/admin/management/workers/list" text='application.back' primary />
      </ButtonsContainer>

      <FormContainer>
        <ItfApiForm
          formId="sendInvitationToUser"
          schemaMayBeDynamic={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values)}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification(__('notification.invitationSendProperly'));
            history.push('/admin/management/workers/list');
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...notifications }, dispatch);

export default connect(null, mapDispatchToProps)(Add);

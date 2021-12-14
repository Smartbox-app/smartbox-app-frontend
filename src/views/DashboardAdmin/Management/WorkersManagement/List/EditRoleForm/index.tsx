import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { apiTable, modal, notifications } from '../../../../../../actions';
import { Button, Spinner } from '../../../../../../components/Common';
import { ButtonsContainer, FormContainer, PageHeader } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';

interface Props {
  userId: string;
  successNotification: (text: string) => void;
  hideModal: () => void;
  refreshApiTableData: () => void;
}

const EditRoleForm = ({ userId, successNotification, hideModal, refreshApiTableData }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text='application.save' type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/change-role';
  const sendUrl = `user/role/${userId}`;

  return (
    <>
      <PageHeader title='application.workerRoleChange' />
      <FormContainer>
        <ItfApiForm
          formId="addOrderForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values, 'PATCH')}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification('notification.workerPositionChanged');
            refreshApiTableData();
            hideModal();
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...notifications, ...modal, ...apiTable }, dispatch);

export default connect(null, mapDispatchToProps)(EditRoleForm);

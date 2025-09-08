import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { DiscountReq } from 'smartbox-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Spinner } from '../../../../../components/Branded';
import { ButtonsContainer, FieldsColumn, FormContainer, FormHeader } from '../../../../../components/Layout';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { apiTable, modal, notifications } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';
import { mapFields } from '../../../../../utils/fields-mapper';

interface Props {
  userId: string;
  hideModal: () => void;
  refreshApiTableData: () => void;
  successNotification: (text: string) => void;
}

const UserEdit = ({ userId, successNotification, hideModal, refreshApiTableData }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `user/form/update-user/${userId}`;
  const sendUrl = `user/someone/${userId}`;

  const customSendFetcher = (formId: string, values: DiscountReq) => {
    return ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );
  };

  return (
    <FormContainer>
      <FormHeader title="application.editUserData" />
      <FieldsColumn>
        <ItfApiForm
          formId="editUserForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            successNotification(__('application.changesSavedSuccess'));
            refreshApiTableData();
            hideModal();
          }}
          onTranslateString={formOnTranslateString}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...apiTable,
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(UserEdit);

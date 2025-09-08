import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { connect, useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { AddGiftReq } from 'smartbox-types';
import { modal, notifications } from '../../../../../actions';
import { FormContainer, ButtonsContainer, FormHeader, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';


const UpdatePass = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.change" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/update-password';
  const sendUrl = 'user/pwd';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer>
      <FormHeader title="application.changePasswordToService" />
      <FieldsColumn>
        <ItfApiForm
          formId="changePass"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            dispatch(successNotification('notification.passChangedSuccess'));
            dispatch(hideModal());
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(UpdatePass);

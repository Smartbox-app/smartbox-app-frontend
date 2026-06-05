import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddGiftReq } from 'smartbox-types';
import { modal, notifications } from '../../../../../actions';
import { ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { mapFields } from 'src/utils/fields-mapper';


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
    <>
      <Modal.Header title={__('application.changePasswordToService')} />
      <Modal.Content>
      <FieldsColumn>
        <ItfApiForm
          formId="changePass"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification('notification.passChangedSuccess'));
            dispatch(hideModal());
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
        />
      </FieldsColumn>
      </Modal.Content>
    </>
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

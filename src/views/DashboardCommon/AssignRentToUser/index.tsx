import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { AssignRentReq, BoxListRes } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

type Props = {
  box: BoxListRes;
};

export const AssignRentToUser = ({ box }: Props) => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `rent/form/assign-user/${box.stockId}`;
  const sendUrl = 'rent/assign';

  return (
    <>
      <Modal.Header title={__('application.assignRent')} />
      <Modal.Content>
        <p>
          {__('application.boxToAssign')}
          <strong>{box.identifier}</strong>
        </p>
        <p>{__('application.assignRentToUser')}</p>

        <FormContainer>
          <ItfApiForm
            formId="assignRentToUserForm"
            schemaMayBeDynamic={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(formId: string, values: AssignRentReq) =>
              ApiService.sendForm(sendUrl, {
                ...values,
                boxId: box.id,
                stockId: box.stockId,
              })
            }
            submitButton={submitButton}
            onSavedSuccessfully={() => {
              dispatch(successNotification(__('application.rentAssigned')));
              dispatch(hideModal());
              dispatch(refreshApiTableData());
            }}
            onRenderFullField={mapFields}
            onTranslateString={formOnTranslateString}
            thirdPartyComponents={{
              ReactSelect: ReactSelectOverride,
              ReactCreatableSelect,
            }}
          />
        </FormContainer>
      </Modal.Content>
    </>
  );
};

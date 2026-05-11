import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import {
  ButtonsContainer,
  FormContainer,
  SectionHeader,
} from '../../../components/Layout';
import { Button, Spinner } from '../../../components/Branded';
import ApiService from '../../../services/api-service';
import { formOnTranslateString } from '../../../utils/trans-form';
import { ReactSelectOverride } from '../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../actions/notifications';
import { mapFields } from '../../../utils/fields-mapper';
import { __ } from '../../../helpers/i18n';
import { AssignRentReq, BoxListRes } from 'smartbox-types';
import { hideModal } from '../../../actions/modal';
import { refreshApiTableData } from '../../../actions/api-table';

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
      <FormContainer>
        <SectionHeader title="application.assignRent" />
        <p>
          {__('application.boxToAssign')}
          <strong>{box.identifier}</strong>
        </p>
        <p>{__('application.assignRentToUser')}</p>

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
    </>
  );
};

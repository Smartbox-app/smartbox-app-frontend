import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { AddonReq } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';
import { serializeBoxGroupIds } from '../serialize-box-group-ids';

interface Props {
  id: string;
  stockId: string;
}

const Edit = ({ id, stockId }: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `addon/form/${stockId}/${id}`;
  const sendUrl = `addon/${id}`;

  return (
    <>
      <Modal.Header title={__('application.editAddon')} />
      <Modal.Content>
        <FormContainer>
          <ItfApiForm
            formId="updateAddon"
            schemaCacheEnabled={false}
            schemaMayBeDynamic={true}
            // useFormDataInsteadOfPlainObject
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(
              formId: string,
              values: AddonReq & { file?: File },
            ) => {
              const formData = new FormData();
              formData.append('stockId', stockId);
              formData.append(
                'acceptances',
                JSON.stringify(values.acceptances),
              );
              formData.append('order', values.order.toString());
              formData.append('active', values.active.toString());
              formData.append('name', values.name);
              formData.append('slug', values.slug);
              formData.append('tax', values.tax);
              formData.append('description', values.description);
              formData.append(
                'additionalDescription',
                values.additionalDescription,
              );
              formData.append('required', values.required.toString());
              formData.append('fileText', values.fileText || '');
              formData.append('noPricing', values.noPricing.toString());
              formData.append(
                'boxGroupIds',
                serializeBoxGroupIds(values.boxGroupIds),
              );
              formData.append('newRentOnly', values.newRentOnly.toString());
              formData.append(
                'userFileAllowed',
                values.userFileAllowed.toString(),
              );
              formData.append(
                'userFileRequirement',
                values.userFileRequirement || '',
              );
              formData.append('userFileText', values.userFileText || '');

              if (values.file) {
                if (typeof values.file === 'string')
                  formData.append('file', values.file);
                else formData.append('file', values.file, values.file.name);
              }

              return ApiService.sendForm(sendUrl, formData, 'PATCH');
            }}
            submitButton={submitButton}
            onRenderFullField={mapFields}
            onSavedSuccessfully={() => {
              dispatch(successNotification('application.addonEdited'));
              dispatch(hideModal());
              dispatch(refreshApiTableData());
            }}
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

export { Edit };

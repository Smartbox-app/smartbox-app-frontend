import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { AddonReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

import { appendNameI18nFields } from '../append-name-i18n';
import { serializeBoxGroupIds } from '../serialize-box-group-ids';

const Add = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();

  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `addon/form/${stockId}`;
  const sendUrl = 'addon';

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons`}
              text="application.back"
              primary
            />
          </ButtonsContainer>
        }
      >
        {__('application.addAddon')}
      </HeaderWithActions>

      <FormContainer highlight>
        <ItfApiForm
          formId="addAddon"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: AddonReq & { file?: File }) => {
            const formData = new FormData();
            formData.append('stockId', stockId);
            if (values.acceptances)
              formData.append(
                'acceptances',
                JSON.stringify(values.acceptances),
              );
            formData.append('order', values.order.toString());
            formData.append('active', values.active.toString());
            formData.append('name', values.name);
            appendNameI18nFields(
              formData,
              values as unknown as Record<string, unknown>,
            );
            formData.append('slug', values.slug);
            formData.append('tax', values.tax);
            formData.append('description', values.description);
            formData.append(
              'additionalDescription',
              values.additionalDescription,
            );
            formData.append('required', values.required.toString());
            formData.append('fileText', values.fileText || '');
            formData.append(
              'userFileAllowed',
              values.userFileAllowed.toString(),
            );
            formData.append('noPricing', values.noPricing.toString());
            formData.append(
              'boxGroupIds',
              serializeBoxGroupIds(values.boxGroupIds),
            );
            formData.append('newRentOnly', values.newRentOnly.toString());
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

            return ApiService.sendForm(sendUrl, formData);
          }}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification('application.addonAdded'));
            history.push(
              `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons`,
            );
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            ReactSelect: ReactSelectOverride,
            ReactCreatableSelect,
          }}
        />
      </FormContainer>
    </Section>
  );
};

export { Add };

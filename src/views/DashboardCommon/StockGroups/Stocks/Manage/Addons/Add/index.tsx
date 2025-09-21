import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch, useSelector } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import {
  ButtonsContainer,
  FormContainer,
  SimpleHeader,
} from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { history } from '../../../../../../../App';
import { ReactSelectOverride } from '../../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../../actions/notifications';
import { __ } from '../../../../../../../helpers/i18n';
import UserService from '../../../../../../../services/user-service';
import { ApplicationState } from '../../../../../../../reducers';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { useParams } from 'react-router';
import { AddonReq } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions, Section } from 'src/components/ui';

const Add = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();

  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'addon/form';
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
            formData.append(
              'userFileAllowed',
              values.userFileAllowed.toString(),
            );
            formData.append(
              'noPricing',
              values.noPricing.toString(),
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

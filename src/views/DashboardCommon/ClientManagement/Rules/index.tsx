import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UserRole } from 'smartbox-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from '../../../../components/Branded';
import { ButtonsContainer, Section } from '../../../../components/Layout';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { ApplicationState } from '../../../../reducers';
import { successNotification } from '../../../../actions/notifications';
import { __ } from '../../../../helpers/i18n';
import { mapFields } from '../../../../utils/fields-mapper';
import { useGetMyDetailsQuery } from 'src/queries';

interface Props {
    userId?: string;
}

const ManageTenantRules = ({ userId }: Props) => {
    const dispatch = useDispatch();
      const { data: user } = useGetMyDetailsQuery();

    if (!user) return null;

    const fetchUrl = user.role === UserRole.admin && userId ? `tenant/form/admin-rules/${userId}` : 'tenant/form/rules';
    const sendUrl = user.role === UserRole.admin && userId ? `tenant/admin/rules/${userId}` : 'tenant/rules';

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );




    const customSendFetcher = (formId: string, values) => {
        return ApiService.sendForm(
            sendUrl,
            values,
            'POST',
        );
    };

    return (
        <Section highlight>
            <ItfApiForm
                formId="tenantRulesForm"
                schemaMayBeDynamic={false}
                schemaCacheEnabled={false}
                useFormDataInsteadOfPlainObject
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={customSendFetcher}
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification(__('application.tenantUpdated')));
                }}
                onTranslateString={formOnTranslateString}
            />
        </Section>
    );
};

export { ManageTenantRules }
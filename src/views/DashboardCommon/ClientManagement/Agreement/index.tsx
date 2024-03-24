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
import { getTenantById } from '../../../../actions/tenant';
import { useTenant } from '../../../../hooks/useTenant';

interface Props {
    userId?: string;
}

const ManageTenantAgreement = ({ userId }: Props) => {
    const dispatch = useDispatch();
    const user = useSelector((state: ApplicationState) => state.user.details);
    const { tenant } = useTenant();
    if (!user) return null;

    const fetchUrl = user.role === UserRole.admin && userId ? `tenant/form/admin-agreement/${userId}` : 'tenant/form/agreement';
    const sendUrl = user.role === UserRole.admin && userId ? `tenant/admin/agreement/${userId}` : 'tenant/agreement';

    const deleteImage = async () => {
        await ApiService.callFetch('DELETE', sendUrl, () => {
            dispatch(successNotification(__('application.tenantUpdated')));
            if (!userId && user.tenantId) window.location.reload();
        })
    }

    const submitButton = (
        <ButtonsContainer>
            {tenant && tenant.agreement && <Button
                type="button"
                danger
                text="application.delete"
                click={deleteImage}
            />}
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
                formId="tenantAgreementForm"
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
                    // if (!userId && user.tenantId) window.location.reload();

                }}
                onTranslateString={formOnTranslateString}
            />
        </Section>
    );
};

export { ManageTenantAgreement }
import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

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

import { formDataWithNameI18n } from '../../Addons/append-name-i18n';

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

    const fetchUrl = `box-group-new/form/${id}`;
    const sendUrl = `box-group-new/${id}`;

    return (
        <>
            <Modal.Header title={__('application.editBoxGroup')} />
            <Modal.Content>
            <FormContainer>
            <ItfApiForm
                formId="updateBoxGroup"
                schemaCacheEnabled={false}
                schemaMayBeDynamic={true}
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(_formId: string, values: Record<string, unknown>) => {
                    const formData = formDataWithNameI18n(values);
                    formData.set('stockId', stockId);
                    return ApiService.sendForm(sendUrl, formData, 'PATCH');
                }}
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification('application.boxGroupEdited'));
                    dispatch(hideModal());
                    dispatch(refreshApiTableData());
                }}
                onTranslateString={formOnTranslateString}
                thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
            />
            </FormContainer>
            </Modal.Content>
        </>
    );
};

export { Edit }

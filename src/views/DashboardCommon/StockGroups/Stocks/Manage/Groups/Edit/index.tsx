import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { ButtonsContainer, FormContainer } from '../../../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { Button, Spinner } from '../../../../../../../components/Branded';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../../actions/notifications';
import { __ } from '../../../../../../../helpers/i18n';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { hideModal } from '../../../../../../../actions/modal';
import { refreshApiTableData } from '../../../../../../../actions/api-table';

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
                useFormDataInsteadOfPlainObject
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(formId: string, values: FormData) => {
                    values.set('stockId', stockId);
                    return ApiService.sendForm(sendUrl, values, 'PATCH')}
                }
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

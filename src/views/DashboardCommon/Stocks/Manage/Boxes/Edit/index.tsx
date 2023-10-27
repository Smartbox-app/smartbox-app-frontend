import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { ButtonsContainer, FormContainer, FormHeader } from '../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../components/Branded';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { ReactSelectOverride } from '../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../actions/notifications';
import { __ } from '../../../../../../helpers/i18n';
import { mapFields } from '../../../../../../utils/fields-mapper';
import { hideModal } from '../../../../../../actions/modal';
import { refreshApiTableData } from '../../../../../../actions/api-table';

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

    const fetchUrl = `box/form/${id}`;
    const sendUrl = `box/${id}`;

    return (
        <FormContainer>
            <FormHeader title="application.editBox" />
            <ItfApiForm
                formId="updateBox"
                schemaCacheEnabled={false}
                schemaMayBeDynamic={true}
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, { ...values, stockId }, 'PATCH')}
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification('notification.boxEdited'));
                    dispatch(hideModal());
                    dispatch(refreshApiTableData());
                }}
                onTranslateString={formOnTranslateString}
                thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
            />
        </FormContainer>
    );
};

export { Edit }

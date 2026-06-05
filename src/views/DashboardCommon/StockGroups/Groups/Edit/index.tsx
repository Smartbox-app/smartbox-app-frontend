import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { ButtonsContainer, FormContainer, FormHeader } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { __ } from '../../../../../helpers/i18n';
import { mapFields } from '../../../../../utils/fields-mapper';
import { hideModal } from '../../../../../actions/modal';
import { refreshApiTableData } from '../../../../../actions/api-table';
import { StockGroupReq } from 'smartbox-types';

interface Props {
    id: string;
}

const Edit = ({ id }: Props) => {
    const dispatch = useDispatch();

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = `stock-group/form/${id}`;
    const sendUrl = `stock-group/${id}`;

    return (
        <FormContainer>
            <FormHeader title="application.editStockGroup" />
            <ItfApiForm
                formId="updateStockGroup"
                schemaCacheEnabled={false}
                schemaMayBeDynamic={true}
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(formId: string, values: StockGroupReq) => ApiService.sendForm(sendUrl, values, 'PATCH')}
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification('notification.stockGroupUpdatedCorrectly'));
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

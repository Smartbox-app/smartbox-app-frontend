import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch, useSelector } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { PageHeader, ButtonsContainer, FormContainer, Section } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from '../../../../../App';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { __ } from '../../../../../helpers/i18n';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { mapFields } from '../../../../../utils/fields-mapper';


const Add = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: ApplicationState) => state.user.details!);

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = 'stock/form/add';
    const sendUrl = 'stock';

    return (
        <Section>
            <PageHeader title="application.addStock" />
            <ButtonsContainer>
                <Button to={`/${UserService.getSlugByRole(user.role)}/stocks`} text="application.back" primary />
            </ButtonsContainer>
            <p>{__('application.addStockDescription')}</p>
            <FormContainer highlight>
                <ItfApiForm
                    formId="addStock"
                    schemaCacheEnabled={false}
                    schemaMayBeDynamic={true}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values)}
                    submitButton={submitButton}
                    onRenderFullField={mapFields}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('notification.stockAddedCorrectly'));
                        history.push(`/${UserService.getSlugByRole(user.role)}/stocks`);
                    }}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
        </Section>
    );
};

export { Add }

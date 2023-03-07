import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { PageHeader, ButtonsContainer, FormContainer, Section } from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { history } from '../../../../App';
import { ReactSelectOverride } from '../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../actions/notifications';
import { __ } from '../../../../helpers/i18n';


const Add = () => {
    const dispatch = useDispatch();

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
                <Button to="/admin/stocks" text="application.back" primary />
            </ButtonsContainer>
            <p>{__('application.addStockDescription')}</p>
            <p><strong>{__('application.addStockDescriptionImportant')}</strong></p>
            <FormContainer>
                <ItfApiForm
                    formId="addStock"
                    schemaMayBeDynamic={false}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values)}
                    submitButton={submitButton}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('notification.stockAddedCorrectly'));
                        history.push('/admin/stocks');
                    }}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
        </Section>
    );
};

export { Add }

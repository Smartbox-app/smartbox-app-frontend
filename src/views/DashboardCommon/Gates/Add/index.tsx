import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { PageHeader, ButtonsContainer, FormContainer, Section } from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Branded';
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

    const fetchUrl = 'gate/form/add';
    const sendUrl = 'gate/admin';

    return (
        <Section>
            <PageHeader title="application.addGate" />
            <ButtonsContainer>
                <Button to="/admin/gates" text="application.back" primary />
            </ButtonsContainer>
            <FormContainer>
                <ItfApiForm
                    formId="addGate"
                    schemaCacheEnabled={false}
                    schemaMayBeDynamic={true}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values)}
                    submitButton={submitButton}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('notification.gateAddedCorrectly'));
                        history.push('/admin/gates');
                    }}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
        </Section>
    );
};

export { Add }

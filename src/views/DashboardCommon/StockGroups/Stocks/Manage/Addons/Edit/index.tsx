import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { ButtonsContainer, FormContainer, FormHeader } from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { ReactSelectOverride } from '../../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../../actions/notifications';
import { __ } from '../../../../../../../helpers/i18n';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { hideModal } from '../../../../../../../actions/modal';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { AddonReq } from 'smartbox-types';

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

    const fetchUrl = `addon/form/${id}`;
    const sendUrl = `addon/${id}`;

    return (
        <FormContainer>
            <FormHeader title="application.editAddon" />
            <ItfApiForm
                formId="updateAddon"
                schemaCacheEnabled={false}
                schemaMayBeDynamic={true}
                // useFormDataInsteadOfPlainObject
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(formId: string, values: AddonReq & { file?: File }) => {

                    const formData = new FormData();
                    formData.append('stockId', stockId);
                    formData.append('acceptances', JSON.stringify(values.acceptances));
                    formData.append('name', values.name);
                    formData.append('slug', values.slug);
                    formData.append('tax', values.tax);
                    formData.append('description', values.description);
                    formData.append('additionalDescription', values.additionalDescription);
                    formData.append('required', values.required.toString());
                    formData.append('fileText', values.fileText || '');
                    formData.append('userFileAllowed', values.userFileAllowed.toString());
                    formData.append('userFileRequirement', values.userFileRequirement || '');
                    formData.append('userFileText', values.userFileText || '');

                    if (values.file) {
                        if (typeof values.file === 'string') formData.append('file', values.file);
                        else formData.append('file', values.file, values.file.name);
                    }

                    return ApiService.sendForm(sendUrl, formData, 'PATCH')
                }
                }
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification('application.addonEdited'));
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

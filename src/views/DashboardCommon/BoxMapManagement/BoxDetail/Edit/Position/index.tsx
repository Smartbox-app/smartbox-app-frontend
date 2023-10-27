import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { connect } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq } from 'smartbox-types';
import { boxes, modal, notifications } from '../../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../../components/Layout';
import { Alert } from '../../../../../../components/Common';
import { Button, Spinner } from '../../../../../../components/Branded';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { __ } from '../../../../../../helpers/i18n';

import './Position.scss';
import { ReactSelectOverride } from '../../../../../../components/Common/ReactSelectOverride';

interface Props {
  rentId: string;
  stockId: string;
  hideModal: () => void;
  successNotification: (text: string) => void;
  fetchBoxStatuses: (stockId: string) => void;
  showModal: (content: React.ReactNode) => void;
}

const Position = ({ rentId, stockId, successNotification, fetchBoxStatuses, hideModal, showModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.move" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = `rent/form/change-user-box/${rentId}`;
  const sendUrl = `rent/user-box/${rentId}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    showModal(
      <>
        <div className="modal-alert-wrapper">
          <Alert type="primary" text="application.userWillGetMailWithInformation" />
          <Alert type="primary" text="application.actionCanNotBeUnDone" />
        </div>
        <ButtonsContainer max>
          <Button text="application.cancel" danger click={() => hideModal()} />
          <Button
            success
            type="submit"
            text="application.understood"
            click={async () => {
              await hideModal();
              await ApiService.sendForm(
                sendUrl,
                {
                  ...values,
                },
                'PATCH',
              );
              await successNotification('notification.userMovedSuccess');
              await fetchBoxStatuses(stockId);
            }}
          />
        </ButtonsContainer>
      </>,
    );
  };

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="change-user-box"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onSavedSuccessfully={() => {
          hideModal();
          fetchBoxStatuses(stockId);
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
        onRenderFullField={(field: any, errors: any, fieldHtmlId: string, currentValue: any, onChange: any) => {
          const optionsArray = field.options.possibleValues;
          const reactSelectOptions = field.options
            ? Object.keys(optionsArray).map((item: any) => ({ label: optionsArray[item], value: item }))
            : ([{ label: '', value: '' }] as any);

          return (
            <div className="form-field">
              <label htmlFor={fieldHtmlId}>
                <p>{field.title}</p>
                <ReactSelectOverride
                  id={fieldHtmlId}
                  name={fieldHtmlId}
                  required={field.required}
                  onChange={(value: any) => onChange(value.value)}
                  options={reactSelectOptions}
                  noOptionsMessage={() => __('application.lackOfThisSizeStorage')}
                  placeholder={__('application.selectPlaceholder')}
                  isSearchable={false}
                  meta={{
                    error: errors.length ? __(errors[0].messageWithPlaceholders, errors[0].params) : null,
                  }}
                />
              </label>
            </div>
          );
        }}
      />
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...boxes, ...notifications }, dispatch);

export default connect(null, mapDispatchToProps)(Position);

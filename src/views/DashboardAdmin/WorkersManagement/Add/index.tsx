import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { PageHeader, ButtonsContainer, FormContainer } from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { notifications } from '../../../../actions';
import { history } from '../../../../App';

interface Props {
  successNotification: (text: string) => void;
}

const Add = ({ successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Wyślij zaproszenie" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/invite-worker';
  const sendUrl = 'user/invite-worker';

  return (
    <>
      <PageHeader title="Wyślij zaproszenie dla pracownika" />
      <ButtonsContainer>
        <Button to="/admin/managment/workers/list" text="Powrót" primary />
      </ButtonsContainer>

      <FormContainer>
        <ItfApiForm
          formId="addOrderForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values)}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification('Poprawnie wysłano zaproszenie.');
            history.push('/amin/orders/list');
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...notifications }, dispatch);

export default connect(null, mapDispatchToProps)(Add);

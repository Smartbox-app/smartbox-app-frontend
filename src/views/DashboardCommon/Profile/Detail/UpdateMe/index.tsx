import React from 'react';
import { connect } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { AddGiftReq, UserRes } from 'smartbox-types';
import { history } from '../../../../../App';
import { FormContainer, ButtonsContainer, FieldsColumn, FormHeader } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import { ApplicationState } from '../../../../../reducers';
import ApiService from '../../../../../services/api-service';
import UserService from '../../../../../services/user-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { __ } from '../../../../../helpers/i18n';
import { modal, notifications, user } from '../../../../../actions';

interface Props {
  user: UserRes;
  fetchMyData: () => void;
  successNotification: (text: string) => void;
}

const UpdateMe = ({ successNotification, user, fetchMyData }: Props) => {
  const submitButton = (
    <ButtonsContainer max>
      <Button
        text='application.back'
        type="button"
        primary
        to={`/${UserService.getSlugByRole(user.role)}/profile/detail`}
      />
      <Button text='application.change' type="submit" success />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/update-me';
  const sendUrl = 'user/me';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer>
      <FormHeader title={__('application.editYourData')} />
      <FieldsColumn>
        <ItfApiForm
          formId="EditUserProfileData"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={async () => {
            successNotification(__('notification.dataChangedSuccess'));
            await fetchMyData();
            history.push(`/${UserService.getSlugByRole(user.role)}/profile/detail`);
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...notifications, ...user }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UpdateMe);

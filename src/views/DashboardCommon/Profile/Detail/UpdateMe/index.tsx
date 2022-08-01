import React from 'react';
import { connect, useDispatch } from 'react-redux';
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
import { modal, notifications, user } from '../../../../../actions';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';

interface Props {
  user: UserRes;
  fetchMyData: () => void;
  successNotification: (text: string) => void;
}

const UpdateMe = ({ successNotification, user, fetchMyData }: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button
        text="application.cancel"
        type="button"
        danger
        click={() => {
          dispatch(modal.hideModal());
        }}
      />
      <Button text="application.change" type="submit" success />
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
            successNotification('notification.dataChangedSuccess');
            await fetchMyData();
            dispatch(modal.hideModal());
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
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

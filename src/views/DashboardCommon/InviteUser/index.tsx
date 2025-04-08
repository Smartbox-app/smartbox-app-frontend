import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { ButtonsContainer, FormContainer } from '../../../components/Layout';
import { Button, Spinner } from '../../../components/Branded';
import ApiService from '../../../services/api-service';
import { formOnTranslateString } from '../../../utils/trans-form';
import { notifications } from '../../../actions';
import { history } from '../../../App';
import { ReactSelectOverride } from '../../../components/Common/ReactSelectOverride';
import UserService from '../../../services/user-service';
import { mapFields } from '../../../utils/fields-mapper';
import { InviteWorkerReq } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import { PageHeader } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  successNotification: (text: string) => void;
}

const InviteUser = ({ successNotification }: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.sendInvitation" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/invite-worker';
  const sendUrl = 'user/invite-user';

  if (!user) return null;

  return (
    <>
      <PageHeader>{__('application.preInvitation')}</PageHeader>
      <ButtonsContainer>
        <Button
          to={`/${UserService.getSlugByRole(user.role)}/management/invitations`}
          text="application.back"
          primary
        />
      </ButtonsContainer>

      <FormContainer highlight>
        <ItfApiForm
          formId="sendInvitationToUser"
          schemaMayBeDynamic={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: InviteWorkerReq) =>
            ApiService.sendForm(sendUrl, values)
          }
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification('notification.invitationSendProperly');
            history.push(
              `/${UserService.getSlugByRole(user.role)}/management/users/list`,
            );
          }}
          onRenderFullField={mapFields}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            ReactSelect: ReactSelectOverride,
            ReactCreatableSelect,
          }}
        />
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...notifications }, dispatch);

export default connect(null, mapDispatchToProps)(InviteUser);

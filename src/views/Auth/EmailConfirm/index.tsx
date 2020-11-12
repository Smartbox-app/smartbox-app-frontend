import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth } from '../../../actions';
import { Button, Spinner } from '../../../components/Common';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  ButtonsContainer,
  FormContainer,
  LogoContainer,
  PageContent,
  Section,
  SectionHeader,
} from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';

interface RouteProps {
  userId: string;
  updateToken: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  emailVerification: (userId: string, updateToken: string) => void;
}

const EmailConfirm = ({ emailVerification, match }: Props) => {
  useEffect(() => {
    emailVerification(match.params.userId, match.params.updateToken);
  }, []);
  return (
    <PageContent>
      <Section>
        <FormContainer>
          <LogoContainer />
          <SectionHeader title="Dziękujemy za rejestrację" />
          <p className="">Trwa weryfikacja maila....</p>
          <Spinner />
        </FormContainer>
      </Section>
    </PageContent>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailConfirm));

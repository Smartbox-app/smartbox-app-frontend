import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';

import './Cookies.scss';
import { user } from '../../../actions';

interface Props {
  isRulesAndRodoAccepted: boolean;
  acceptationCookies: () => void;
}

const Cookies = ({ isRulesAndRodoAccepted, acceptationCookies }: Props) => {
  return (
    <div className={`cookies-information ${isRulesAndRodoAccepted ? 'hide-cookies-bar' : ''}`}>
      <p>
        W tej aplikacji używamy plików cookies w celu zapewnienia użytkownikom efektywnego korzystania ze strony, a
        także narzędzi analitycznych, promocyjnych i reklamowych w celu reklamy, badania rynku oraz badania preferencji
        użytkowników. Korzystając z Aplikacji Smartbox, możesz wyrazić zgodę na korzystanie z plików cookies oraz
        wymienionych narzędzi. Więcej informacji na temat plików cookies oraz stosowanych narzędzi znajdziesz w naszej{' '}
        <a target="_blank" href="/assets/20210422_Polityka_Prywatnosci_Smartbox.pdf">
          <u>Polityki&nbsp;prywatności</u>
        </a>
        .
      </p>
      <span className="exit" onClick={() => acceptationCookies()}>
        &times;
      </span>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  isRulesAndRodoAccepted: state?.user?.details?.isRulesAndRodoAccepted,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...user,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cookies);

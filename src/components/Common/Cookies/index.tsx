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
        Ta strona używa ciastek. Korzystając ze strony wyrażasz zgodę na używanie cookie, zgodnie z aktualnymi
        ustawieniami przeglądarki.
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

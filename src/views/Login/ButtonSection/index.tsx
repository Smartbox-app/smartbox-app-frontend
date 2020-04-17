import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Common';

import './ButtonSection.scss';

const ButtonsSection = () => (
  <div className="login-buttons-section">
    <ButtonsContainer max column>
      <Button text="Zaloguj się" big type="submit" primary rounded />
      <Button text="Zarejestruj się" big type="submit" outline rounded />
    </ButtonsContainer>
    {/* <div className="remember-me">
      <CheckBox
        label="Zapamiętaj mnie"
        name="remember-me"
        checked={false}
        handleChange={() => {}}
        // handleChange={() => this.setState({})}
        // checked={rememberMeStatus}
      />
    </div> */}
    <p>
      Zapomniałeś hasła?{' '}
      <Link className="light" to="/restore-pass">
        Kliknij tutaj
      </Link>
    </p>
  </div>
);

export default ButtonsSection;

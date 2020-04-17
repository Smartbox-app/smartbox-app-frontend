import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Common';

const ButtonsSection = () => (
  <div className="login-buttons-section">
    <ButtonsContainer max>
      <Button text="Zaloguj się" big type="submit" />
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

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/Branded";
import { FbButton } from "./FbButton";
// import GoogleButton from "./GoogleButton";
import { __ } from "../../../../helpers/i18n";

import "./ButtonSection.scss";
import { useTenant } from "../../../../hooks/useTenant";

const ButtonsSection = () => {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return (
    <div className="login-buttons-section">
      <Button text="application.login" big type="submit" primary rounded />
      <FbButton />
      {/* <GoogleButton /> */}
      {tenant.rules && tenant.privacy && (
        <Button
          text="application.register"
          big
          to={tenant.slides.length > 0 ? "/welcome" : "register"}
          outline
          rounded
        />
      )}
      <p className="lost-pass">
        {__("application.forgotPass")}{" "}
        <Link className="light" to="/restore-pass">
          {__("application.clickHere")}
        </Link>
      </p>
      <p className="lost-activation-link">
        <Link className="light" to="/resend-activation-link">
          {__("application.noActivationEmail")}
        </Link>
      </p>
    </div>
  );
};

export default ButtonsSection;

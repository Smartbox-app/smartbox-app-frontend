import ApiService from "../../../../../services/api-service";
import { __ } from "../../../../../helpers/i18n";
import { useTenant } from "../../../../../hooks/useTenant";
import "./FbButton.scss";

export const FbButton = () => {
  const { tenant } = useTenant();

  if (!tenant || !["testowa", "aplikacja"].includes(tenant.identifier))
    return null;

  const goToFbLogin = () => {
    window.open(`${ApiService.url}auth/facebook?tenantId=${tenant.identifier}`);
  };

  return (
    <button onClick={goToFbLogin} className="facebook-button-custom">
      <span className="fa fa-facebook" />
      {`${__("application.continueWith")} Facebook`}
    </button>
  );
};

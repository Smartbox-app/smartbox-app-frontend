import { PaymentStatus } from "smartbox-types";
import {
  Button,
  LogoContainer,
  PageContent,
} from "../../../components/Branded";
import { ButtonsContainer, Section } from "../../../components/Layout";

import { __ } from "../../../helpers/i18n";

import "./PaymentResult.scss";

interface Props {
  status?: PaymentStatus;
}

export const PaymentResult = ({ status }: Props) => {
  const getTitle = () => {
    switch (status) {
      case PaymentStatus.wait:
        return __("application.paymentPending");
      case PaymentStatus.accepted:
        return __("application.paymentSuccesful");
      case PaymentStatus.failure:
        return __("application.paymentFailed");
      default:
        return __("application.paymentError");
    }
  };
  return (
    <PageContent>
      <div className="payment-result-container">
        <LogoContainer />
        <div className="payment-result-content">
        <p className="status-text">{getTitle()}</p>
        {status === PaymentStatus.accepted ? (
          <div className="content-text">
            <p>{__("application.thanks")}</p>
            <p>{__("application.invoiceWasSent")}</p>
          </div>
        ) : null}
        <ButtonsContainer className="payment-button--container">
          <Button big success text="application.backToApp" to="/" />
        </ButtonsContainer>
      </div>
      </div>
    </PageContent>
  );
};

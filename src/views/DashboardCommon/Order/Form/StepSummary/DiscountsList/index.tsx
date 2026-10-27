import { useDispatch, useSelector } from 'react-redux';

import { RentAgreementType } from 'smartbox-types';
import { resetDiscountCode } from 'src/actions/order';
import { Alert } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Header, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { ApplicationState } from 'src/reducers';

import 'src/views/DashboardCommon/Order/Form/StepSummary/DiscountsList/DiscountsList.scss';

const DiscountsList = () => {
  const { calculatedPriceDetails, endDate, discountCode, agreementType } =
    useSelector((state: ApplicationState) => state.order);
  const dispatch = useDispatch();
  const isOpenEnded = agreementType === RentAgreementType.OpenEnded;

  if (!isOpenEnded && !endDate) return null;

  return (
    <Section>
      <Header variant="h2"> {__('application.usedPrice')}</Header>
      {calculatedPriceDetails.length === 0 && (
        <Alert type="notice" text="application.standardPrice" />
      )}
      {calculatedPriceDetails.map((detail, index) => (
        <Typography key={index}>{detail}</Typography>
      ))}
      <ButtonsContainer>
        {discountCode && (
          <Button
            text="application.deleteDiscountCode"
            variant="primary"
            onClick={() => dispatch(resetDiscountCode())}
          />
        )}
      </ButtonsContainer>
    </Section>
  );
};

export { DiscountsList };

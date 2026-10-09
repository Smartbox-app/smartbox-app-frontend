import { useDispatch, useSelector } from 'react-redux';

import { ButtonsContainer } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import { RentAgreementType } from 'smartbox-types';

import './DiscountsList.scss';
import { resetDiscountCode } from '../../../../../../actions/order';
import { Button, Header, Section, Typography } from 'src/components/ui';
import { Alert } from 'src/components/Common';


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

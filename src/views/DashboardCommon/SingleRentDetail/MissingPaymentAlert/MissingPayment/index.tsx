import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { MyRentDetails } from 'smartbox-types';
import { clearOrder, updateFormData } from 'src/actions/order';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Stack, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { Wallet } from 'src/icons';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { dateOnly } from 'src/utils/format-date';

interface Props {
  rent: MyRentDetails;
}

const StyledMissingPayment = styled('div')(({ theme }) => ({
  borderRadius: theme.radius.innerSurface,
  border: 'none',
  padding: theme.spacing * 4,
  background: theme.colors.surface.error.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'column',
  gap: theme.spacing * 4,
  '@media(min-width: 768px)': {
    flexDirection: 'row',
  },
}));

const Info = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing *2
}))

const StyledIcon = styled('span')(({ theme }) => ({
  paddingTop: theme.spacing / 4,
  color: theme.colors.surface.error.primary,
}));

// @TODO HANDLE
const MissingPayment = ({ rent }: Props) => {
  // const { pricing } = usePricing();
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();

  const handleDebtPayOff = (rentId: string) => {
    dispatch(clearOrder());
    dispatch(
      updateFormData({ size: rent.size.toString(), stock: rent.stockId }),
    );
    history.push(
      `/${UserService.getSlugByRole(user!.role)}/order/step/duration/${rentId}`,
    );
  };

  return (
    <StyledMissingPayment>
      <Info>
        <StyledIcon
          className="fa fa-exclamation-circle notification-marker"
          aria-hidden="true"
        />
        <Stack>
          <Typography>
            <strong>{__('application.debtOnRent')}</strong>
          </Typography>
          <Typography>
            {__('application.rentFinished')}{' '}
            <strong>{dateOnly(rent.finishAt)}</strong>
          </Typography>
        </Stack>
      </Info>
      <ButtonsContainer>
        <Button
          text="application.payOffDebt"
          type="button"
          size="large"
          iconLeft={<Wallet />}
          disabled={rent.pendingPayments}
          variant="error"
          onClick={() => handleDebtPayOff(rent.id)}
        />
      </ButtonsContainer>
    </StyledMissingPayment>
  );
};

export default MissingPayment;

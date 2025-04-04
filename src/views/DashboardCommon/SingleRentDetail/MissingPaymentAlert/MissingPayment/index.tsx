import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails } from 'smartbox-types';
import { singleRent } from '../../../../../actions';
import { Button } from '../../../../../components/Branded';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';
import { dateOnly } from '../../../../../utils/format-date';
import { __ } from '../../../../../helpers/i18n';
import { clearOrder, updateFormData } from '../../../../../actions/order';
import { history } from '../../../../../App';
import { useGetMyDetailsQuery } from 'src/queries';

interface Props {
  rent: MyRentDetails;
}

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
    <div className="missing-payment-alert-wrapper">
      <p className="main-info">{__('application.debtOnRent')}</p>
      <div className="date-wrapper">
        <p className="single-line">
          {__('application.rentFinished')}{' '}
          <strong>{dateOnly(rent.finishAt)}</strong>
        </p>
      </div>
      <ButtonsContainer>
        <Button
          text="application.payOffDebt"
          type="button"
          danger
          click={() => handleDebtPayOff(rent.id)}
        />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MissingPayment);

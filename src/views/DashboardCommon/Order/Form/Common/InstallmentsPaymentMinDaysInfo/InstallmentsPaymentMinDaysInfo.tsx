import { useSelector } from 'react-redux';
import { Alert } from 'src/components/Common';
import { ApplicationState } from 'src/reducers';

export const InstallmentsPaymentMinDaysInfo = () => {
  const { minRentDaysForInstallments } = useSelector(
    (state: ApplicationState) => state.order,
  );

  if (!minRentDaysForInstallments) return null;

  return (
    <Alert type="notice">
      Dla płatności ratalnej wymagane minimum <strong>{minRentDaysForInstallments}</strong> dni najmu.
    </Alert>
  );
};

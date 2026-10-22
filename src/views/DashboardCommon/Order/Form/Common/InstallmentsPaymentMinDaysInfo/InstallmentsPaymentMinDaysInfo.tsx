import { useSelector } from 'react-redux';
import { Alert } from 'src/components/Common';
import { __ } from 'src/helpers/i18n';
import { ApplicationState } from 'src/reducers';

export const InstallmentsPaymentMinDaysInfo = () => {
  const { minRentDaysForInstallments } = useSelector(
    (state: ApplicationState) => state.order,
  );

  if (!minRentDaysForInstallments) return null;

  return (
    <Alert type="notice">
      {__('application.phrases.installmentsMinDays', {
        count: minRentDaysForInstallments,
      })}
    </Alert>
  );
};

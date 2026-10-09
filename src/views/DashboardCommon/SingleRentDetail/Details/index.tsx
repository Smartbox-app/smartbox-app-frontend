import { MyRentDetails } from 'smartbox-types';
import { dateOnly, dateOnlyLocalTime } from '../../../../utils/format-date';
import { __ } from '../../../../helpers/i18n';
import { translateBoxDisplayStatus } from '../../../../utils/box-display-status';
import { Row } from '../../../../components/Common';

import './Details.scss';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useRent } from 'src/hooks/useRent';

interface Props {
  singleRent: MyRentDetails;
}

const Details = ({ singleRent }: Props) => {
  const { getText } = useTenantNaming();
  const { formatFinishAt, getAgreementTypeLabel } = useRent();
  return (
    <div>
      <Row
        label="application.startDate"
        content={
          singleRent
            ? dateOnly(singleRent.startAt)
            : dateOnlyLocalTime(new Date())
        }
      />
      <Row
        label="application.endDate"
        content={
          singleRent
            ? formatFinishAt(singleRent.finishAt, singleRent.agreementType)
            : dateOnlyLocalTime(new Date())
        }
      />
      <Row
        label="application.agreementType"
        content={getAgreementTypeLabel(singleRent?.agreementType)}
      />
      <Row
        label={getText('name_of')}
        content={singleRent.stockName || __('application.lack')}
      />
      <Row
        label="application.storeSize"
        content={<div className="size">{singleRent.size} m²</div>}
      />
      <Row
        label="application.storeNumber"
        content={singleRent.number || __('application.lack')}
      />
      <Row
        label="application.storeState"
        content={
          singleRent.status
            ? translateBoxDisplayStatus(singleRent.status)
            : __('application.lack')
        }
      />
    </div>
  );
};
export default Details;

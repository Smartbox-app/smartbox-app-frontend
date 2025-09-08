import { MyRentDetails } from 'smartbox-types';
import { dateOnly } from '../../../../utils/format-date';
import { __ } from '../../../../helpers/i18n';
import { Row } from '../../../../components/Common';

import './Details.scss';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
  singleRent: MyRentDetails;
}

const Details = ({ singleRent }: Props) => {
  const { getText } = useTenantNaming();
  return (
    <div>
      <Row
        label="application.startDate"
        content={`${dateOnly(singleRent ? singleRent.startAt : new Date())}`}
      />
      <Row
        label="application.endDate"
        content={`${dateOnly(singleRent ? singleRent.finishAt : new Date())}`}
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
        content={singleRent.status || __('application.lack')}
      />
    </div>
  );
};
export default Details;

import { MyRentList } from 'smartbox-types';
import { Alert } from 'src/components/Common';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

import Legend from './Legend';
import Single from './Single';

import './History.scss';

interface Props {
  data: MyRentList[];
}

const History = ({ data }: Props) => {
  const { getText } = useTenantNaming();
  if (data.length === 0)
    return <Alert type="notice" text="application.lackOfHistory" />;

  const dataToDisplay = data.map((single: MyRentList, key: number) => (
    <Single single={single} key={`history-${key}`} />
  ));
  return (
    <div className="history-wrapper">
      <div className="history-line header">
        <span className="header-cell period">{__('application.period')}</span>
        <span className="header-cell number">{__('application.number')}</span>
        <span className="header-cell size">
          {__('application.orderStepSize')}
        </span>
        <span className="header-cell stock last">
          {getText('name')}
        </span>
      </div>
      <ul className="history-list">{dataToDisplay}</ul>
      <Legend />
    </div>
  );
};

export default History;

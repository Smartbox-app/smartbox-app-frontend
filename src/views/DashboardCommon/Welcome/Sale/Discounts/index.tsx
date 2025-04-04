import './Discounts.scss';
import { __ } from '../../../../../helpers/i18n';
import { Alert } from '../../../../../components/Common';

interface Props {
  discounts: string[];
}

const Discounts = ({ discounts }: Props) => {
  if (!discounts.length)
    return <Alert type="notice" text="application.noDiscountsToShow" />;
  const dataToDisplay = discounts.map((name: string, key: number) => (
    <div className="single-discont" key={`discounts-${key}`}>
      {' '}
      {name}
    </div>
  ));

  return <div className="discounts-wrapper">{dataToDisplay}</div>;
};

export default Discounts;

import { __ } from '../../../helpers/i18n';
import { PageHeader as UIPageHeader } from 'src/components/ui';

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => (
  <UIPageHeader>{__(title)}</UIPageHeader>
);

export default PageHeader;

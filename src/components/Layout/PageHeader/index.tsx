import { PageHeader as UIPageHeader } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => (
  <UIPageHeader>{__(title)}</UIPageHeader>
);

export default PageHeader;

import { Header as UIHeader } from 'src/components/ui';
import { __ } from '../../../helpers/i18n';

interface Props {
  title: string;
  noMargin?: boolean;
}

const SectionHeader = ({ title, noMargin }: Props) => (
  <UIHeader variant="h2">{__(title)}</UIHeader>
);

export default SectionHeader;

import { Header as UIHeader } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  title: string;
  noMargin?: boolean;
}

const SectionHeader = ({ title }: Props) => (
  <UIHeader variant="h2">{__(title)}</UIHeader>
);

export default SectionHeader;

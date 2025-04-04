import styled from 'styled-components';
import { __ } from '../../../../../../../../helpers/i18n';

export type StorageMainInfoProps = {
  identifier: string;
  isWarning: boolean;
};

const StyledInfo = styled('h3')<{ isWarning: boolean }>(
  ({ isWarning, theme }) => ({
    fontWeight: 700,
    margin: 0,
    width: '100%',
    color: isWarning ? theme.colors.danger : theme.colors.text.primary
  }),
);

export const StorageMainInfo = ({ identifier, isWarning }: StorageMainInfoProps) => {
  return (
    <StyledInfo isWarning={isWarning}>
      {__('application.miniStorage')} {identifier}
    </StyledInfo>
  );
};

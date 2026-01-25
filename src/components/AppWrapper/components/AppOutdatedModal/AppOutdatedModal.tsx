import styled from 'styled-components';
import { __ } from '../../../../helpers/i18n';
import { Typography } from '../../../ui';

const StyledContainer = styled('div')({
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  gap: 24,
  flex: 1,
  fontSize: '1.2rem'
});

const StyledTitle = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 500,
});

export type AppOutdatedModalProps = {
  platform: 'android' | 'ios';
};

export const AppOutdatedModal = ({ platform }: AppOutdatedModalProps) => {
  return (
    <StyledContainer>
      <StyledTitle>{__('mobileConfig.newVersion')}</StyledTitle>
      {platform === 'android' ? (
        <Typography>{__('mobileConfig.androidNewVersion')}</Typography>
      ) : (
        <Typography>{__('mobileConfig.iosNewVersion')}</Typography>
      )}
    </StyledContainer>
  );
};

import styled from 'styled-components';

import { Logo } from 'src/components/Branded';
import { Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

const StyledContainer = styled('div')({
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  gap: 24,
  flex: 1,
});

const StyledTitle = styled(Typography)({
  fontSize: '2.8rem',
  fontWeight: 500,
});

const StyledDescription = styled(Typography)({
  fontSize: '1.6rem',
  lineHeight: '2.em'
});

export type AppOutdatedModalProps = {
  platform: 'android' | 'ios';
};

export const AppOutdatedModal = ({ platform }: AppOutdatedModalProps) => {
  return (
    <Modal closable={false}>
      <Modal.Content>
        <StyledContainer>
          <Logo />
          <StyledTitle>{__('mobileConfig.newVersion')}</StyledTitle>
          {platform === 'android' ? (
            <StyledDescription>
              {__('mobileConfig.androidNewVersion')}
            </StyledDescription>
          ) : (
            <StyledDescription>
              {__('mobileConfig.iosNewVersion')}
            </StyledDescription>
          )}
        </StyledContainer>
      </Modal.Content>
    </Modal>
  );
};

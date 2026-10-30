import styled from 'styled-components';

import { Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Settings } from 'src/icons';

const StyledContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  flex: 1,
  flexDirection: 'column',
  gap: 24,
  svg: {
    fill: '#000',
    height: 40,
    width: 40
  }
});

const StyledTypography = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 500,
  lineHeight: 1,
});

export const AppMaintenanceModal = () => {
  return (
    <Modal.Content>
      <StyledContainer>
        <Settings />
        <StyledTypography>{__('mobileConfig.maintenance')}</StyledTypography>
      </StyledContainer>
    </Modal.Content>
  );
};

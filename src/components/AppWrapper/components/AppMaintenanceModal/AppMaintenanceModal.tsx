import styled from 'styled-components';
import { __ } from '../../../../helpers/i18n';
import { Modal, Typography } from '../../../ui';
import { Settings } from '../../../../icons';

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

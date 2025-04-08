import ApiService from '../../../../../services/api-service';
import { __ } from '../../../../../helpers/i18n';
import { useTenant } from '../../../../../hooks/useTenant';
import { Button } from 'src/components/ui';
import styled from 'styled-components';
import { lighten } from 'polished';

const StyledButton = styled(Button)({
  backgroundColor: '#4267b2',
  '&:hover': {
    backgroundColor: lighten(0.2, '#4267b2'),
  }
});

export const FbButton = () => {
  const { tenant } = useTenant();

  if (!tenant || !['testowa', 'aplikacja'].includes(tenant.identifier))
    return null;

  const goToFbLogin = () => {
    window.open(`${ApiService.url}auth/facebook?tenantId=${tenant.identifier}`);
  };

  return (
    <StyledButton
      size="large"
      iconLeft={<span className="fa fa-facebook" />}
      onClick={goToFbLogin}
      text="application.sign_in_fb"
    />
  );
};

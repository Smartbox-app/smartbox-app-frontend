import ApiService from '../../../../../services/api-service';
import { __ } from '../../../../../helpers/i18n';
import { useTenant } from '../../../../../hooks/useTenant';
import { Button } from 'src/components/ui';
import styled from 'styled-components';
import { darken } from 'polished';

const StyledButton = styled(Button)({
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    color: '#000',
    backgroundColor: darken(0.2, '#fff'),
  },
});

export const GoogleButton = () => {
  const { tenant } = useTenant();

  if (
    !tenant ||
    ![
      'testowa',
      'sbox',
      'aplikacja',
      'citybox24',
      'superbox',
      'moibox',
      'rentbox',
      'tyskiemagazyny',
      'kielceboxy',
      'jumbostorage',
      'twojemagazyny24',
      'hdboxpl',
      'tubox',
      'mojschowek',
      'boxymagazynowe',
      'easybox',
      'mojmagazyn',
      'megabox',
      'krakbox',
      'przechowajto',
      'szuflandia',
      'wlasnybox',
      'nidobox',
    ].includes(tenant.identifier)
  )
    return null;

  const goToGoogleLogin = () => {
    window.open(`${ApiService.url}auth/google?tenantId=${tenant.identifier}`);
  };

  return (
    <StyledButton
      type="button"
      size="large"
      iconLeft={<span className="fa fa-google" />}
      onClick={goToGoogleLogin}
      text="application.sign_in_google"
    />
  );
};

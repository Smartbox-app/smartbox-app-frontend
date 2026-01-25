import ApiService from '../../../../../services/api-service';
import { __ } from '../../../../../helpers/i18n';
import { useTenant } from '../../../../../hooks/useTenant';
import { Button } from 'src/components/ui';
import styled from 'styled-components';
import { lighten } from 'polished';
import { getColorForBackground } from 'src/utils/color';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const StyledButton = styled(Button)({
  backgroundColor: '#4267b2',
  color: getColorForBackground('#4267b2'),
  '&:hover': {
    backgroundColor: lighten(0.2, '#4267b2'),
    color: getColorForBackground('#4267b2'),
  },
});

export const FbButton = () => {
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
      'biastorage',
      'twojbox',
      'osiedle',
      's3box',
      'test',
    ].includes(tenant.identifier)
  )
    return null;

  const goToFbLogin = () => {
    if (Capacitor.isNativePlatform()) {
      Browser.open({
        url: `${ApiService.url}auth/facebook?tenantId=${tenant.identifier}&source=mobile`,
      });
    } else {
      window.open(
        `${ApiService.url}auth/facebook?tenantId=${tenant.identifier}`,
      );
    }
  };

  return (
    <StyledButton
      type="button"
      size="large"
      iconLeft={<span className="fa fa-facebook" />}
      onClick={goToFbLogin}
      text="application.sign_in_fb"
    />
  );
};

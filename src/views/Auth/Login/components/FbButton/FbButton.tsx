import ApiService from '../../../../../services/api-service';
import { __ } from '../../../../../helpers/i18n';
import { useTenant } from '../../../../../hooks/useTenant';
import { Button } from 'src/components/ui';
import styled from 'styled-components';
import { lighten } from 'polished';
import { getColorForBackground } from 'src/utils/color';
// import { FacebookLogin } from '@capacitor-community/facebook-login';
import { Capacitor } from '@capacitor/core';

import { useSocialLoginMutation } from 'src/mutations';
import { Spinner } from 'src/components/Branded';
import { SocialLogin } from '@capgo/capacitor-social-login';

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
  const { mutate: socialLogin, isPending } = useSocialLoginMutation();

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

  const goToFbLogin = async () => {
    if (Capacitor.isNativePlatform()) {
      // const result = await FacebookLogin.login({ permissions: ['email'] });
      const res = await SocialLogin.login({
        provider: 'facebook',
        options: {
          permissions: ['email', 'public_profile'],
          limitedLogin: true,
        },
      });

      if (res.result.accessToken?.token) {
        socialLogin({
          provider: 'facebook',
          token: res.result.accessToken?.token,
          tenant: tenant.identifier,
        });
      } else if (res.result.idToken) {
        socialLogin({
          provider: 'facebook-jwt',
          token: res.result.idToken,
          tenant: tenant.identifier,
        });
      }
    } else {
      window.open(
        `${ApiService.url}auth/facebook?tenantId=${tenant.identifier}`,
      );
    }
  };

  return (
    <>
      {isPending ? <Spinner halfTransparent overlay /> : null}
      <StyledButton
        type="button"
        size="large"
        disabled={isPending}
        iconLeft={<span className="fa fa-facebook" />}
        onClick={goToFbLogin}
        text="application.sign_in_fb"
      />
    </>
  );
};

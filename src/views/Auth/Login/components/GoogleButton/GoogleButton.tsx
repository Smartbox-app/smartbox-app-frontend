import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { darken } from 'polished';
import styled from 'styled-components';

import { Spinner } from 'src/components/Branded';
import { Button } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { useSocialLoginMutation } from 'src/mutations';
import ApiService from 'src/services/api-service';

const StyledButton = styled(Button)({
  backgroundColor: '#db4a39',
  color: '#fff',
  '&:hover': {
    color: '#000',
    backgroundColor: darken(0.2, '#db4a39'),
  },
});

export const GoogleButton = () => {
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
      'pakstak'
    ].includes(tenant.identifier)
  )
    return null;

  const goToGoogleLogin = async () => {
    if (Capacitor.isNativePlatform()) {
      const res = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email'],
        },
      });
      if ('idToken' in res.result && res.result.idToken) {
        socialLogin({
          provider: 'google',
          token: res.result.idToken,
          tenant: tenant.identifier,
        });
      }
    } else {
      window.open(`${ApiService.url}auth/google?tenantId=${tenant.identifier}`);
    }
  };

  return (
    <>
      {isPending ? <Spinner halfTransparent overlay /> : null}
      <StyledButton
        type="button"
        size="large"
        disabled={isPending}
        iconLeft={<span className="fa fa-google" />}
        onClick={goToGoogleLogin}
        text="application.sign_in_google"
      />
    </>
  );
};

export class SocialLoginDto {
  provider: 'google' | 'facebook' | 'facebook-jwt';
  tenant: string;
  token: string;
}

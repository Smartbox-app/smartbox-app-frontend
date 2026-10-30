export const ACTIVATION_TOKEN_QUERY_PARAM = 'activationToken';

export const buildActivateAccountPath = (activationToken: string) =>
  `/activate-account?${ACTIVATION_TOKEN_QUERY_PARAM}=${encodeURIComponent(activationToken)}`;

export const getActivationTokenFromSearch = (search: string): string | null => {
  const token = new URLSearchParams(search).get(ACTIVATION_TOKEN_QUERY_PARAM);
  return token?.trim() || null;
};

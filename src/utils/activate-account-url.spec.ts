import {
  buildActivateAccountPath,
  getActivationTokenFromSearch,
} from 'src/utils/activate-account-url';

describe('activate account url', () => {
  it('encodes the token and reads it back', () => {
    const path = buildActivateAccountPath('a b/c');

    expect(path).toBe('/activate-account?activationToken=a%20b%2Fc');
    expect(getActivationTokenFromSearch(path.split('?')[1])).toBe('a b/c');
  });

  it('returns null when the token is missing or blank', () => {
    expect(getActivationTokenFromSearch('')).toBeNull();
    expect(getActivationTokenFromSearch('activationToken=%20')).toBeNull();
  });
});

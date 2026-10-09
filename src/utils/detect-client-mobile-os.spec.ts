import { getClientMobileOs } from './detect-client-mobile-os';

const setUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });
};

describe('getClientMobileOs', () => {
  const original = navigator.userAgent;

  afterEach(() => {
    setUserAgent(original);
  });

  it('detects android and ios from the user agent', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 14)');
    expect(getClientMobileOs()).toBe('android');

    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)');
    expect(getClientMobileOs()).toBe('ios');

    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
    expect(getClientMobileOs()).toBeNull();
  });
});

import {
  captureAttributionParams,
  getAttributionSearch,
  getStoredAttributionParams,
  pickAttributionParams,
  withAttributionSearch,
} from 'src/utils/attribution-params';

describe('attribution params', () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('keeps campaign params and ignores the rest', () => {
    expect(
      pickAttributionParams('?utm_source=ad&fbclid=1&gclid=2&_gl=3&step=summary&utm_empty='),
    ).toEqual({
      utm_source: 'ad',
      fbclid: '1',
      gclid: '2',
      _gl: '3',
    });
  });

  it('stores new params without clearing params captured earlier', () => {
    captureAttributionParams('?utm_source=ad');
    captureAttributionParams('?utm_campaign=spring');
    captureAttributionParams('');

    expect(getStoredAttributionParams()).toEqual({
      utm_source: 'ad',
      utm_campaign: 'spring',
    });
  });

  it('lets the current url overwrite a stored value', () => {
    captureAttributionParams('?utm_source=old');
    window.history.replaceState({}, '', '/order?utm_source=new');

    expect(getAttributionSearch()).toBe('?utm_source=new');
  });

  it('rebuilds a path from attribution params only', () => {
    captureAttributionParams('?utm_campaign=spring');

    expect(withAttributionSearch('/order?utm_source=ad&step=1')).toBe(
      '/order?utm_campaign=spring&utm_source=ad',
    );
    expect(withAttributionSearch('/order')).toBe('/order?utm_campaign=spring');
  });
});

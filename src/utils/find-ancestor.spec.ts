import { findAncestor } from './find-ancestor';

describe('findAncestor', () => {
  it('walks up to the matching element', () => {
    document.body.innerHTML =
      '<div class="outer"><span id="mid"><em id="inner"></em></span></div>';

    expect(findAncestor(document.getElementById('inner'), '.outer')?.id).toBe(
      '',
    );
    expect(
      findAncestor(document.getElementById('inner'), '.outer')?.className,
    ).toBe('outer');
    expect(findAncestor(document.getElementById('inner'), '.missing')).toBeNull();
  });
});

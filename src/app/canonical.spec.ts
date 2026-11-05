import { canonicalHref } from './canonical';

describe('canonicalHref', () => {
  it('keeps the root slash and strips other trailing slashes', () => {
    expect(canonicalHref('/')).toBe('https://mfstapert.dev/');
    expect(canonicalHref('/blog/')).toBe('https://mfstapert.dev/blog');
    expect(canonicalHref('/blog/why-i-no-longer-use-npx/')).toBe(
      'https://mfstapert.dev/blog/why-i-no-longer-use-npx',
    );
    expect(canonicalHref('/resume?x=1')).toBe('https://mfstapert.dev/resume');
  });
});

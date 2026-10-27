import debounce from 'src/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls the function once after the wait, using the latest call', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    debounced('a');
    debounced('b');
    jest.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('calls immediately and then waits before calling again', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200, true);

    debounced();
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(200);
    debounced();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

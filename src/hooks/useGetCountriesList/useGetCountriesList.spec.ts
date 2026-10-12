import { renderHook } from '@testing-library/react';
import { useGetCountriesList } from './useGetCountriesList';

describe('useGetCountriesList', () => {
  it('should return the countries list', () => {
    const countriesList = renderHook(() => useGetCountriesList());
    expect(countriesList.result.current.slice(0, 4)).toEqual([
      { value: 'PL', label: 'Polska' },
      { value: 'UA', label: 'Ukraina' },
      { value: 'DE', label: 'Niemcy' },
      { value: 'AT', label: 'Austria' },
    ]);
  });
});

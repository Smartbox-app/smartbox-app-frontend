import { appendAddonFiles, appendCollectionFields } from 'src/utils/rent-form-data';

describe('rent form data', () => {
  it('formats dates, serializes objects, and skips empty values', () => {
    const formData = appendCollectionFields(new FormData(), {
      finishAt: new Date(2026, 9, 1, 15),
      note: '',
      missing: null,
      cost: 0,
      isCompany: false,
      orderAddons: { lock: 10 },
    });

    expect(formData.get('finishAt')).toBe('2026-10-01');
    expect(formData.get('note')).toBeNull();
    expect(formData.get('missing')).toBeNull();
    expect(formData.get('cost')).toBe('0');
    expect(formData.get('isCompany')).toBe('false');
    expect(formData.get('orderAddons')).toBe('{"lock":10}');
  });

  it('names addon files with the addon id', () => {
    const formData = appendAddonFiles(new FormData(), {
      'addon-1': { file: new File(['photo'], 'photo.jpg') },
      'addon-2': { file: null },
    });

    const file = formData.get('addonFiles');
    expect(file).toBeInstanceOf(File);
    expect((file as File).name).toBe('addon-1--photo.jpg');
  });
});

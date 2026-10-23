import { BoxGroupType } from 'smartbox-types';

import { i18next, t } from '../i18n/i18n';
import { getBoxGroupTypeLabel } from './box-group-labels';

describe('tenant naming', () => {
  afterEach(async () => {
    await i18next.changeLanguage('pl');
  });

  it.each(['pl', 'en', 'cz', 'ua', 'de'])(
    'keeps site and location wording apart in %s',
    async (language) => {
      await i18next.changeLanguage(language);

      expect(t('naming.stock.name')).not.toEqual(t('naming.location.name'));
      expect(t('naming.stock.box')).not.toEqual(t('naming.location.box'));
      expect(t('naming.stock.boxes')).not.toEqual(t('naming.location.boxes'));
      expect(t('naming.stock.boxes_list')).toEqual(
        t('naming.location.boxes_list'),
      );
      expect(t('naming.stock.on')).not.toEqual(t('naming.location.on'));
      expect(
        t('naming.stock.confirm_delete', { name: 'Nord', address: '1' }),
      ).toContain('Nord');
      expect(
        t('naming.stock.confirm_delete', { name: 'Nord', address: '1' }),
      ).not.toEqual(
        t('naming.location.confirm_delete', { name: 'Nord', address: '1' }),
      );
    },
  );
});

describe('box group type labels', () => {
  afterEach(async () => {
    await i18next.changeLanguage('pl');
  });

  it('uses the accusative form inside the reservation sentence', async () => {
    await i18next.changeLanguage('pl');
    expect(getBoxGroupTypeLabel(BoxGroupType.locker)).toBe('skrytkę');
    expect(
      t('application.orderAssignedBox', {
        type: getBoxGroupTypeLabel(BoxGroupType.storage),
      }),
    ).toContain('minimagazyn');

    await i18next.changeLanguage('cz');
    expect(getBoxGroupTypeLabel(BoxGroupType.storage)).toBe(
      'skladovací jednotku',
    );
    expect(getBoxGroupTypeLabel(BoxGroupType.parking)).toBe('parkovací místo');
    expect(getBoxGroupTypeLabel(BoxGroupType.locker)).toBe('úložnou schránku');
    expect(t('templates.boxTypeAccusative')).toContain('úložnou schránku');
    expect(t('templates.boxTypeNoun')).toContain('úložné schránky');
    expect(t('templates.boxTypeNoun')).not.toEqual(
      t('templates.boxTypeAccusative'),
    );

    await i18next.changeLanguage('ua');
    expect(getBoxGroupTypeLabel(BoxGroupType.storage)).toBe('складську комірку');
    expect(getBoxGroupTypeLabel(BoxGroupType.locker)).toBe('комірку');
    expect(t('templates.boxTypeAccusative')).toContain('комірку');
    expect(t('templates.boxTypeNoun')).toContain('комірки');

    await i18next.changeLanguage('de');
    expect(getBoxGroupTypeLabel(BoxGroupType.storage)).toBe('Lagereinheit');
    expect(getBoxGroupTypeLabel(BoxGroupType.locker)).toBe('Schließfach');
    expect(getBoxGroupTypeLabel(BoxGroupType.parking)).toBe('Stellplatz');
    expect(
      t('application.orderAssignedBox', {
        type: getBoxGroupTypeLabel(BoxGroupType.parking),
      }),
    ).toContain('Reserviert wurde: Stellplatz');
    expect(t('templates.boxTypeNoun')).toContain('Stellplatzes');
    expect(t('templates.boxTypeYourGenitive')).toContain('Ihres Stellplatzes');
  });
});

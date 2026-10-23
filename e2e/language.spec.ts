import { expect, Page, test } from '@playwright/test';
import { e2eAdmin, e2eStockName } from './accounts';
import { expectApiOk, hideCookieBar, login } from './helpers';

const documentLanguage = (page: Page) =>
  page.evaluate(() => document.documentElement.lang);

const storedLanguage = (page: Page) =>
  page.evaluate(() => localStorage.getItem('language'));

const openLogin = async (page: Page) => {
  await hideCookieBar(page);
  await page.goto('/login');
};

test.describe('default browser language', () => {
  test.describe('Polish browser', () => {
    test.use({ locale: 'pl-PL' });

    test('loads Polish when no language is stored', async ({ page }) => {
      await openLogin(page);

      await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
      await expect(page.getByLabel('Hasło')).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBeNull();
      await expect.poll(documentLanguage.bind(null, page)).toBe('pl');
    });

    test('keeps a language picked before login', async ({ page }) => {
      await openLogin(page);
      await page.getByRole('button', { name: 'PL', exact: true }).click();
      await page
        .getByRole('group', { name: 'Language' })
        .getByRole('button', { name: 'EN', exact: true })
        .click();

      await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBe(JSON.stringify('en'));
      await expect.poll(documentLanguage.bind(null, page)).toBe('en');
    });
  });

  test.describe('English browser', () => {
    test.use({ locale: 'en-US' });

    test('loads English when no language is stored', async ({ page }) => {
      await openLogin(page);

      await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBeNull();
      await expect.poll(documentLanguage.bind(null, page)).toBe('en');
    });
  });

  test.describe('unsupported browser language', () => {
    test.use({ locale: 'fr-FR' });

    test('falls back to Polish', async ({ page }) => {
      await openLogin(page);

      await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
      await expect(page.getByLabel('Hasło')).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBeNull();
      await expect.poll(documentLanguage.bind(null, page)).toBe('pl');
    });
  });
});

const chooseAccountLanguage = async (page: Page, code: 'EN' | 'PL') => {
  const current = code === 'EN' ? 'PL' : 'EN';
  await page.getByRole('button', { name: current, exact: true }).click();
  const updated = page.waitForResponse(
    (response) =>
      response.url().includes('user/me/lang') &&
      response.request().method() === 'PATCH' &&
      response.ok(),
  );
  await page
    .getByRole('group', { name: 'Language' })
    .getByRole('button', { name: code, exact: true })
    .click();
  await updated;
};

const accountLanguage = async (page: Page) => {
  const lang = await documentLanguage(page);
  const stored = await storedLanguage(page);
  const logoutName = lang === 'en' ? 'Log out' : 'Wyloguj';
  const logoutVisible = await page.getByRole('button', { name: logoutName }).isVisible();
  if (!logoutVisible) return 'pending';
  if (lang === 'en' && stored === JSON.stringify('en')) return 'en';
  if (lang === 'pl' && (stored === JSON.stringify('pl') || stored === null)) return 'pl';
  return 'pending';
};

const restorePolishAccount = async (page: Page) => {
  if (page.isClosed()) return;
  try {
    if (!page.url().includes('/client')) {
      await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
    }
    await expect.poll(() => accountLanguage(page)).not.toBe('pending');
    if ((await accountLanguage(page)) !== 'en') return;
    await chooseAccountLanguage(page, 'PL');
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();
  } catch {
    // Best-effort restore; bilingual helpers cover leftover EN admin UI.
  }
};

test.describe('user language', () => {
  test.use({ locale: 'pl-PL' });

  test('keeps the language saved on the account', async ({ page }) => {
    test.setTimeout(90_000);
    let changed = false;

    try {
      await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
      await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();

      changed = true;
      await chooseAccountLanguage(page, 'EN');
      await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBe(JSON.stringify('en'));
      await expect.poll(documentLanguage.bind(null, page)).toBe('en');

      await page.reload();
      await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
      await expect.poll(documentLanguage.bind(null, page)).toBe('en');

      const loggedOut = page.waitForResponse(
        (response) =>
          response.url().includes('auth/logout') && response.request().method() === 'GET',
      );
      await page.getByRole('button', { name: 'Log out' }).click();
      await loggedOut;
      await page.goto('/login');
      await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBeNull();
      await expect.poll(documentLanguage.bind(null, page)).toBe('pl');

      await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
      await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
      await expect.poll(storedLanguage.bind(null, page)).toBe(JSON.stringify('en'));
      await expect.poll(documentLanguage.bind(null, page)).toBe('en');

      await chooseAccountLanguage(page, 'PL');
      await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();
      await expect.poll(documentLanguage.bind(null, page)).toBe('pl');
      changed = false;
    } finally {
      if (changed) await restorePolishAccount(page);
    }
  });
});

const plContent = 'E2E szablon PL {{name}}';
const enContent = 'E2E template EN {{name}}';
const enStockContent = 'E2E stock EN {{name}}';

const message = (page: Page) => page.getByLabel('Treść wiadomości');

const newRental = (page: Page) =>
  page.locator('details').filter({
    has: page.getByRole('heading', { name: 'Nowy wynajem', exact: true }),
  });

const smsLanguageRow = (page: Page, code: string) =>
  newRental(page)
    .getByRole('listitem')
    .filter({ hasText: 'sms' })
    .filter({ hasText: `Ogólny · ${code}` });

const smsLanguageGroup = (page: Page, code: string) =>
  smsLanguageRow(page, code).locator('xpath=ancestor::div[1]');

const openTemplateList = async (page: Page) => {
  await page.goto('/client/management/templates/list');
  const section = newRental(page);
  await section.getByRole('heading', { name: 'Nowy wynajem', exact: true }).click();
  await expect(section.getByRole('heading', { name: 'SMS', exact: true })).toBeVisible();
};

const openGenericSms = async (page: Page, code: 'PL' | 'EN') => {
  await openTemplateList(page);
  await smsLanguageRow(page, code).getByRole('link', { name: 'Edytuj' }).click();
  await expect(page).toHaveURL(
    new RegExp(`/manage/sms/new_rental_sms\\?lang=${code.toLowerCase()}$`),
  );
  await expect(page.getByRole('heading', { name: 'Szablon ogólny' })).toBeVisible();
  await expect(message(page)).toBeVisible();
};

const saveSms = async (page: Page, content: string, lang: 'pl' | 'en') => {
  const field = message(page);
  await expect(async () => {
    await field.fill(content);
    await expect(field).toHaveValue(content, { timeout: 1_000 });
  }).toPass();
  const saved = page.waitForResponse(
    (response) =>
      response.url().includes('template/sms/new_rental_sms') &&
      response.request().method() === 'PATCH',
    { timeout: 15_000 },
  );
  await page.getByRole('button', { name: 'Zapisz' }).click();
  const response = await saved;
  expect(response.request().postDataJSON()).toMatchObject({ lang, content });
  await expectApiOk(response);
  await expect(page.getByText('Zapisano szablon')).toBeVisible();
};

const openSelect = async (page: Page, label: string) => {
  const field = page.locator('label').filter({ hasText: label }).locator('xpath=..');
  await field.locator('.input-select__control').click();
};

const chooseSelectOption = (page: Page, name: string) =>
  page.locator('.input-select__option').filter({ hasText: new RegExp(`^${name}$`) }).click();

const selectTemplateLanguage = async (page: Page, name: 'Polski' | 'English', lang: 'pl' | 'en') => {
  await openSelect(page, 'Język');
  await chooseSelectOption(page, name);
  await expect(page).toHaveURL(new RegExp(`lang=${lang}$`));
};

test.describe('template languages', () => {
  test.use({ locale: 'pl-PL' });

  test('keeps message templates separate for each language', async ({ page }) => {
    test.setTimeout(120_000);
    await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);

    await openTemplateList(page);
    for (const code of ['PL', 'CZ', 'UA', 'DE', 'EN']) {
      await expect(smsLanguageRow(page, code)).toBeVisible();
    }
    await expect(smsLanguageRow(page, 'PL').getByText('Domyślny szablon')).toBeVisible();
    await expect(smsLanguageRow(page, 'EN').getByText('Domyślny szablon')).toBeVisible();

    await smsLanguageRow(page, 'PL').getByRole('link', { name: 'Edytuj' }).click();
    await saveSms(page, plContent, 'pl');

    await openGenericSms(page, 'EN');
    await expect.poll(async () => (await message(page).inputValue()).length).toBeGreaterThan(0);
    await expect(message(page)).not.toHaveValue(plContent);
    await saveSms(page, enContent, 'en');

    await selectTemplateLanguage(page, 'Polski', 'pl');
    await expect(message(page)).toHaveValue(plContent);
    await selectTemplateLanguage(page, 'English', 'en');
    await expect(message(page)).toHaveValue(enContent);

    await openTemplateList(page);
    await smsLanguageGroup(page, 'EN').getByRole('link', { name: 'Dodaj' }).click();
    await expect(page).toHaveURL(/\/manage\/sms\/new_rental_sms\/stock\?lang=en$/);
    await expect(page.getByRole('heading', { name: 'Szablon dla obiektu' })).toBeVisible();
    await openSelect(page, 'Obiekty');
    await chooseSelectOption(page, e2eStockName);
    await page.keyboard.press('Escape');
    await saveSms(page, enStockContent, 'en');
    await expect(page).toHaveURL(/\/stock\/[^/]+$/);

    await page.goto('/client/management/templates/list');
    await expect(newRental(page).getByText('Własny szablon (PL, EN)')).toBeVisible();
    await openTemplateList(page);
    await expect(smsLanguageRow(page, 'PL').getByText('Własny szablon')).toBeVisible();
    await expect(smsLanguageRow(page, 'EN').getByText('Własny szablon')).toBeVisible();
    await expect(
      smsLanguageGroup(page, 'PL').getByText('Brak szablonów dla poszczególnych obiektów'),
    ).toBeVisible();
    await expect(
      smsLanguageGroup(page, 'EN').getByRole('listitem').filter({ hasText: e2eStockName }),
    ).toBeVisible();

    await openGenericSms(page, 'PL');
    await expect(message(page)).toHaveValue(plContent);
    await openGenericSms(page, 'EN');
    await expect(message(page)).toHaveValue(enContent);

    await openTemplateList(page);
    await smsLanguageGroup(page, 'EN')
      .getByRole('listitem')
      .filter({ hasText: e2eStockName })
      .getByRole('link', { name: 'Edytuj' })
      .click();
    await expect(page.getByRole('heading', { name: 'Szablon dla obiektu' })).toBeVisible();
    await expect(message(page)).toHaveValue(enStockContent);
  });
});

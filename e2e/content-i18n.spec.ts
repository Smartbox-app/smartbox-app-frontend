import { expect, Page, test } from '@playwright/test';
import {
  e2eAdmin,
  e2eBoxGroupName,
  e2eInsuranceName,
  e2eRenter,
  e2eStockName,
} from './accounts';
import { expectApiOk, hideCookieBar, login, logout } from './helpers';

const clickNext = async (page: Page) => {
  const next = page
    .getByRole('button', { name: /Dalej|Next/ })
    .or(page.getByRole('link', { name: /Dalej|Next/ }));
  await expect(next).toBeEnabled();
  await next.click();
};

const homePl = 'E2E home PL';
const homeEn = 'E2E home EN';
const systemPl = 'E2E system PL';
const systemEn = 'E2E system EN';
const boxGroupEn = 'E2E 4m EN';
const insuranceEn = 'Insurance EN';

const fillByLabel = async (
  page: Page,
  label: string | RegExp,
  value: string,
) => {
  const field = page.getByRole('textbox', {
    name: label,
    exact: typeof label === 'string',
  });
  await expect(field).toBeVisible();
  await field.fill(value);
};

const saveCommunications = async (page: Page) => {
  const saved = page.waitForResponse(
    (response) =>
      response.url().includes('tenant/communications') &&
      response.request().method() === 'PATCH',
  );
  await page.getByRole('button', { name: /Zapisz|Save/ }).click();
  await expectApiOk(await saved);
};

const chooseUiLanguage = async (page: Page, code: 'EN' | 'PL') => {
  // Closed switcher shows the active code (after logout: PL). Open it, then pick.
  const active = page
    .getByRole('button', { name: 'PL', exact: true })
    .or(page.getByRole('button', { name: 'EN', exact: true }));
  await expect(active.first()).toBeVisible();
  await active.first().click();
  await page
    .getByRole('group', { name: 'Language' })
    .getByRole('button', { name: code, exact: true })
    .click();
};

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

const openGroupEdit = async (page: Page) => {
  await page.goto('/client/locations/stocks/list');
  await page
    .getByRole('row', { name: new RegExp(e2eStockName) })
    .getByRole('button', { name: /Zarządzaj|Manage/ })
    .click();
  await page.getByRole('link', { name: /^Grupy$|^Groups$/, exact: true }).click();
  await page
    .getByRole('row', { name: new RegExp(e2eBoxGroupName) })
    .getByRole('button', { name: /Edytuj|Edit/ })
    .click();
  await expect(page.getByRole('textbox', { name: /^Nazwa$/ })).toBeVisible();
};

const openAddonEdit = async (page: Page) => {
  await page.goto('/client/locations/stocks/list');
  await page
    .getByRole('row', { name: new RegExp(e2eStockName) })
    .getByRole('button', { name: /Zarządzaj|Manage/ })
    .click();
  await page.getByRole('link', { name: /^Dodatki$|^Addons$/, exact: true }).click();
  await page
    .getByRole('row', { name: new RegExp(e2eInsuranceName) })
    .getByRole('button', { name: /Edytuj|Edit/ })
    .click();
  await expect(
    page.getByRole('textbox', { name: 'Nazwa dodatku (English)', exact: true }),
  ).toBeVisible();
};

test.describe('content i18n', () => {
  test.use({ locale: 'pl-PL' });

  test('serves translated messages and names for anonymous lang then account lang', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);

    await page.goto('/client/management/settings/communications');
    await expect(
      page.getByRole('textbox', {
        name: 'Dodatkowa treść wyświetlana na stronie głównej (polski, domyślny)',
      }),
    ).toBeVisible();
    await fillByLabel(
      page,
      'Dodatkowa treść wyświetlana na stronie głównej (polski, domyślny)',
      homePl,
    );
    await fillByLabel(
      page,
      'Dodatkowa treść wyświetlana na stronie głównej (English)',
      homeEn,
    );
    await fillByLabel(page, 'Komunikat systemowy (polski, domyślny).', systemPl);
    await fillByLabel(page, 'Komunikat systemowy (English)', systemEn);
    await saveCommunications(page);

    await openGroupEdit(page);
    await fillByLabel(page, 'Nazwa (English)', boxGroupEn);
    const groupSaved = page.waitForResponse(
      (response) =>
        response.url().includes('box-group-new/') &&
        response.request().method() === 'PATCH',
    );
    await page.getByRole('button', { name: /Zapisz|Save/ }).click();
    await expectApiOk(await groupSaved);

    await openAddonEdit(page);
    await fillByLabel(page, 'Nazwa dodatku (English)', insuranceEn);
    const addonSaved = page.waitForResponse(
      (response) =>
        response.url().includes('addon/') &&
        response.request().method() === 'PATCH',
    );
    await page.getByRole('button', { name: /Zapisz|Save/ }).click();
    await expectApiOk(await addonSaved);

    await logout(page);

    await hideCookieBar(page);
    await page.goto('/login');
    await chooseUiLanguage(page, 'EN');

    const tenantEn = page.waitForResponse(
      (response) =>
        response.url().includes('tenant/e2e') &&
        response.request().method() === 'GET' &&
        response.ok(),
    );
    await page.reload();
    const enBody = (await (await tenantEn).json()) as {
      payload?: { systemMessage?: string; homeMessage?: string };
    };
    expect(enBody.payload?.systemMessage).toBe(systemEn);
    expect(enBody.payload?.homeMessage).toBe(homeEn);
    await expect(page.getByText(systemEn)).toBeVisible();

    await chooseUiLanguage(page, 'PL');
    const tenantPl = page.waitForResponse(
      (response) =>
        response.url().includes('tenant/e2e') &&
        response.request().method() === 'GET' &&
        response.ok(),
    );
    await page.reload();
    const plBody = (await (await tenantPl).json()) as {
      payload?: { systemMessage?: string; homeMessage?: string };
    };
    expect(plBody.payload?.systemMessage).toBe(systemPl);
    expect(plBody.payload?.homeMessage).toBe(homePl);

    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
    await chooseAccountLanguage(page, 'EN');
    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();

    // Account lang wins; home/system messages already showed EN above.
    await expect(page.getByText(homeEn)).toBeVisible();
    await expect(page.getByText(systemEn)).toBeVisible();

    await page
      .getByRole('button', { name: /New storage unit|Nowy minimagazyn/ })
      .click();
    await expect(
      page.getByRole('heading', {
        name: /Please select a (site|location)|Proszę wybrać plac/,
      }),
    ).toBeVisible();
    await page.getByText(e2eStockName, { exact: true }).click();
    await clickNext(page);

    await expect(page.getByText(boxGroupEn, { exact: true })).toBeVisible();
    await page.getByText(boxGroupEn, { exact: true }).click();
    await clickNext(page);

    await expect(
      page.getByRole('heading', { level: 2, name: insuranceEn }),
    ).toBeVisible();

    await chooseAccountLanguage(page, 'PL');
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();

    await logout(page);
    await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
    await page.goto('/client/management/settings/communications');
    await fillByLabel(
      page,
      'Dodatkowa treść wyświetlana na stronie głównej (polski, domyślny)',
      '',
    );
    await fillByLabel(
      page,
      'Dodatkowa treść wyświetlana na stronie głównej (English)',
      '',
    );
    await fillByLabel(page, 'Komunikat systemowy (polski, domyślny).', '');
    await fillByLabel(page, 'Komunikat systemowy (English)', '');
    await saveCommunications(page);
  });
});

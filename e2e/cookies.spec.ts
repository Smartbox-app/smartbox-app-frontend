import { expect, Page, test } from '@playwright/test';

const cookieDialog = (page: Page) => page.getByRole('dialog');

const storedConsent = (page: Page) =>
  page.evaluate(() => localStorage.getItem('cookies'));

test.describe('cookie consent dialog', () => {
  test.use({ locale: 'pl-PL' });

  test('shows until the user chooses', async ({ page }) => {
    await page.goto('/login');

    const dialog = cookieDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Pliki cookies' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Polityce prywatności' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Odrzuć' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Akceptuję' })).toBeVisible();
    await expect.poll(storedConsent.bind(null, page)).toBeNull();
  });

  test('accept hides the dialog and persists', async ({ page }) => {
    await page.goto('/login');

    const dialog = cookieDialog(page);
    await dialog.getByRole('button', { name: 'Akceptuję' }).click();

    await expect(dialog).toBeHidden();
    await expect.poll(storedConsent.bind(null, page)).toBe('accepted');

    await page.reload();
    await expect(cookieDialog(page)).toBeHidden();
    await expect.poll(storedConsent.bind(null, page)).toBe('accepted');
  });

  test('reject hides the dialog and persists', async ({ page }) => {
    await page.goto('/login');

    const dialog = cookieDialog(page);
    await dialog.getByRole('button', { name: 'Odrzuć' }).click();

    await expect(dialog).toBeHidden();
    await expect.poll(storedConsent.bind(null, page)).toBe('rejected');

    await page.reload();
    await expect(cookieDialog(page)).toBeHidden();
    await expect.poll(storedConsent.bind(null, page)).toBe('rejected');
  });
});

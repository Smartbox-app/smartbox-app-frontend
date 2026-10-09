import { expect, test } from '@playwright/test';
import {
  e2ePreviewBoxIdentifier,
  e2eRenter,
  e2eViewer,
} from './accounts';
import { expectApiOk, login, openMyBox } from './helpers';

test('adds and removes a rent authorization', async ({ page }) => {
  await login(page, e2eViewer.email, e2eViewer.password, /\/user/);
  await openMyBox(page, e2ePreviewBoxIdentifier);

  await expect(
    page.getByText('Nikt poza Tobą nie ma upoważnienia do tego wynajmu.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Dodaj upoważnienie' }).click();
  await expect(page.getByRole('heading', { name: 'Dodaj upoważnienie' })).toBeVisible();

  await page.locator('input[name="contact"]').fill(e2eRenter.email);
  const added = page.waitForResponse(
    (response) =>
      response.url().includes('/authorization') &&
      response.request().method() === 'POST',
  );
  const save = page.getByRole('button', { name: 'Zapisz' });
  await save.click();
  const submitted = await Promise.race([
    added.then(() => 'done' as const),
    page.waitForTimeout(4_000).then(() => 'retry' as const),
  ]);
  if (submitted === 'retry') await save.click();
  await expectApiOk(await added);

  await expect(page.getByText(e2eRenter.email)).toBeVisible();

  await page.getByRole('button', { name: 'Cofnij upoważnienie' }).click();
  await expect(
    page.getByText('Czy na pewno chcesz cofnąć upoważnienie tego użytkownika?'),
  ).toBeVisible();
  const removed = page.waitForResponse(
    (response) =>
      response.url().includes('/authorization/') &&
      response.request().method() === 'DELETE',
  );
  await page.getByRole('button', { name: 'Cofnij upoważnienie' }).last().click();
  await expectApiOk(await removed);

  await expect(
    page.getByText('Nikt poza Tobą nie ma upoważnienia do tego wynajmu.'),
  ).toBeVisible();
});

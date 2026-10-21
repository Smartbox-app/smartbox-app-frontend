import { expect, test } from '@playwright/test';
import { ApiErrorCode } from 'smartbox-types';
import { e2eBlocked, e2eBoxGroupName, e2eStockName } from './accounts';
import { login } from './helpers';

const api = 'http://localhost:3002';

const day = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
};

test('blocks a new rent while another rent is unpaid', async ({ page }) => {
  await login(page, e2eBlocked.email, e2eBlocked.password, /\/user/);
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();

  await expect(
    page.getByRole('heading', { name: 'Nie można rozpocząć nowego wynajmu' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Posiadasz nieopłacone przedłużenie istniejącego wynajmu. Opłać zaległość, zanim wynajmiesz kolejną skrytkę.',
    ),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/user\/main/);
});

test('rejects rent/new while a previous rent is unpaid', async ({ page }) => {
  await login(page, e2eBlocked.email, e2eBlocked.password, /\/user/);

  const stocks = await page.request.get(`${api}/stock/list?tenantId=e2e`);
  const stockBody = await stocks.json();
  const stockId = stockBody.payload.find(
    (stock: { name: string; id: string }) => stock.name === e2eStockName,
  ).id;
  const groups = await page.request.get(
    `${api}/box-group-new/all/${stockId}?tenantId=e2e`,
  );
  const groupBody = await groups.json();
  const boxGroupId = groupBody.payload.find(
    (group: { name: string; id: string }) => group.name === e2eBoxGroupName,
  ).id;

  const finish = new Date();
  finish.setDate(finish.getDate() + 29);
  const response = await page.request.post(`${api}/rent/new?source=web&tenantId=e2e`, {
    multipart: {
      stockId,
      boxGroupId,
      startAt: day(new Date()),
      finishAt: day(finish),
      agreementType: 'fixed-term',
      cost: '1',
    },
  });
  const body = await response.json();
  expect(body.result).not.toBe(1);
  expect(body.error_code).toBe(ApiErrorCode.YouHaveNoPaidBoxes);
});

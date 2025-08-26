import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');
});

test.describe('Testing Form', () =>{
  test('Redirije a la paguina principal despues de crear y usar un usuario nuevo', async ({ page }) => {
    await page.getByRole('button', { name: /Regístrate/i }).click();
    await page.getByLabel('Usuario').fill("Cesar");
    await page.getByLabel('Contraseña', { exact: true }).fill('Test@1234');
    await page.getByLabel('Confirmar Contraseña', { exact: true }).fill('Test@1234');
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    const errorMessage = page.locator('text=No se pudo registrar');
    await expect(errorMessage).toBeVisible();
 });
});
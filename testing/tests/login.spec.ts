import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');
});

test.describe('Testing Form', () =>{
  test('Redirije a la paguina principal despues de crear y usar un usuario nuevo', async ({ page }) => {
    // Generar un nombre de usuario aleatorio para evitar conflictos entre navegadores
    const username = `testuser_${Math.floor(Math.random() * 1000000)}`;
    await page.getByRole('button', { name: /Regístrate/i }).click();
    //Llenado del formulario de register
    await page.getByLabel('Usuario').fill(username);
    await page.getByLabel('Contraseña', { exact: true }).fill('Test@1234');
    await page.getByLabel('Confirmar Contraseña', { exact: true }).fill('Test@1234');
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    // Llenado del formulario de login
    await page.getByLabel('Usuario').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Usuario').fill(username);
    await page.getByLabel('Contraseña', { exact: true }).fill('Test@1234');
    await page.getByRole('button', { name: /iniciar/i }).click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
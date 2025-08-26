import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');
}); 

test.describe('Testing Form', () =>{
    test('Login con credenciales incorrectas', async ({ page }) => {
        await page.getByLabel('Usuario').fill('usuario_incorrecto');
        await page.getByLabel('Contraseña', { exact: true }).fill('contraseña_incorrecta');
        await page.getByRole('button', { name: /iniciar/i }).click();
        const errorMessage = page.locator('text=Credenciales incorrectas');
        await expect(errorMessage).toBeVisible();
    });
});
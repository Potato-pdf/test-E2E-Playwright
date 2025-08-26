import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');
});

test.describe('Testing Form', () =>{
  test('Redirije al login despues de registrar', async ({ page }) => {
    // Haz clic en el botón que dice 'Regístrate' para mostrar el formulario de registro
    await page.getByRole('button', { name: /Regístrate/i }).click();
    });
  });
# test-E2E-Playwright

## Instalación y configuración de Playwright

```bash
npm init playwright
```
- Instala Playwright y sus dependencias.
- Genera las carpetas y archivos base para pruebas E2E.
- Crea un test base de ejemplo.

## Estructura recomendada para pruebas E2E

Se recomienda crear una carpeta `e2e` o `testing` en la raíz del proyecto (al mismo nivel que `frontend` y `backend`). Ejemplo:

```
/frontend
/backend
/testing  ← aquí van tus pruebas Playwright
  /tests
    login.spec.ts
    ...
```
Esto permite que las pruebas E2E estén separadas del código fuente y sean fáciles de ubicar y ejecutar.

## Comandos útiles

```bash
npx playwright test
```
- Corre todos los tests que estén escritos.

```bash
npx playwright show-report
```
- Abre una interfaz gráfica con los resultados de los tests.

## Ejemplo de selector Playwright y uso de expresiones regulares

Para interactuar con botones o elementos accesibles, Playwright recomienda usar selectores por rol y nombre:

```typescript
// Hace clic en el botón que dice "Regístrate"
await page.getByRole('button', { name: /Regístrate/i }).click();
```

### ¿Qué significa la opción `i` en `/Regístrate/i`?
- La `i` significa "insensitive" (insensible a mayúsculas/minúsculas).
- Así, el selector encuentra "Regístrate", "regístrate", "REGÍSTRATE", etc.

### ¿Cómo buscar el texto exactamente igual (sensible a mayúsculas/minúsculas)?
Quita la `i` del regex:

```typescript
await page.getByRole('button', { name: /Regístrate/ }).click();
```
Esto solo encontrará el botón que diga exactamente "Regístrate" (con mayúscula y tilde igual).

## Buenas prácticas
- Mantén las pruebas E2E fuera de las carpetas de código fuente.
- Usa selectores accesibles (`getByRole`, `getByLabelText`, etc.) para mayor robustez.
- Documenta los flujos importantes y los comandos de test en este README.

---
Actualizado con ejemplos y recomendaciones para Playwright y pruebas E2E.
## Validar redirección con Playwright

Para asegurarte de que tu aplicación redirige correctamente después de un flujo (por ejemplo, después de iniciar sesión), puedes usar:

```typescript
await expect(page).toHaveURL('http://localhost:3000');
```

Esto hace que la prueba espere y verifique que la URL actual de la página sea exactamente la indicada. Si la redirección ocurre correctamente, la prueba pasa; si no, falla.

Es útil para validar que el usuario llega al dashboard o a la pantalla esperada tras un login, registro, etc.
## Uso de getByLabel en Playwright

Playwright permite seleccionar campos de formulario usando la etiqueta asociada (label), lo que hace los tests más robustos y legibles.

Ejemplo:

```typescript
// Llenar el campo de usuario
await page.getByLabel('Usuario').fill('testuser');
// Llenar el campo de contraseña
await page.getByLabel('Contraseña').fill('Test@1234');
// Llenar el campo de confirmación de contraseña
await page.getByLabel('Confirmar Contraseña').fill('Test@1234');
```

Esto busca los inputs asociados a los labels con ese texto visible. Es recomendable usar `getByLabel` para interactuar con formularios, ya que es más resistente a cambios de estructura HTML que los selectores por clase o id.

---

## Notas sobre sincronización y timeout en Playwright

Cuando usas un timeout en métodos como `waitFor`, Playwright esperará **hasta ese tiempo máximo** a que el elemento aparezca, pero continuará inmediatamente si el elemento ya está visible antes.

Ejemplo:
```js
await page.getByLabel('Usuario').waitFor({ state: 'visible', timeout: 10000 });
```
- Si el campo aparece en 1 segundo, el test sigue en 1 segundo.
- Si tarda 8 segundos, sigue en 8 segundos.
- Solo espera los 10 segundos completos si el campo nunca aparece (y entonces falla).

Esto hace tus tests más robustos y rápidos cuando todo funciona bien, pero tolerantes a pequeños retrasos de renderizado.

---
- Esta línea fuerza que los tests corran UNO DESPUÉS DEL OTRO
  en lugar de en paralelo. Sin esto, cada test corre en un "worker" diferente
   y el username generado en beforeAll no se comparte entre tests.
````
    test.describe.configure({ mode: 'serial' });
````

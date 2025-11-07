import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test('should display product name, price, add to cart button and image', async ({ page }) => {
    await page.goto('http://localhost:3000/product/shtangentsirkul-shts-i-125-0-1-kl-2-stiz');

    // Verify product name
    await expect(page.getByRole('heading', { name: 'Штангенциркуль ШЦ-I-125-0,1 кл.2 СТИЗ' })).toBeVisible();

    // Verify price
    await expect(page.getByText('2 500 ₽')).toBeVisible();

    // Verify Add to Cart button
    await expect(page.getByRole('button', { name: 'Добавить в корзину' })).toBeVisible();

    // Verify product image
    await expect(page.getByRole('img', { name: 'Штангенциркуль ШЦ-I-125-0,1 кл.2 СТИЗ' }).first()).toBeVisible();
  });

  test('should switch tabs and hide previous content', async ({ page }) => {
    await page.goto('http://localhost:3000/product/shtangentsirkul-shts-i-125-0-1-kl-2-stiz');

    // Click on the 'Документация' tab to see if it hides the description
    await page.getByRole('tab', { name: 'Документация' }).click();

    // Verify that content from the 'Описание' tab is not visible
    // This will help debug whether the tab component correctly hides inactive panels.
    await expect(page.getByText('штангенциркули с двусторонним расположением губок')).not.toBeVisible();
  });
});
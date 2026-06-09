const { test, expect } = require('@playwright/test');
const LoginPage = require('../base/LoginPage');
const InventoryPage = require('../base/InventoryPage');
const users = require('../data/users');
const selectors = require('../utils/selectors');
const helpers = require('../utils/helpers');

test.describe('SauceDemo Inventory Page Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.open();
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    await inventoryPage.assertInventoryPage();
  });

  test('TC014: Inventory page UI validation', async ({ page }) => {
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator(selectors.inventory.title)).toBeVisible();
    await expect(page.locator(selectors.inventory.appLogo)).toBeVisible();
    await helpers.expectButtonEnabled(page, selectors.inventory.menuButton);
    await helpers.expectButtonEnabled(page, selectors.inventory.cartLink);
    await expect(page.locator(selectors.inventory.sortContainer)).toBeVisible();
    await expect(page.locator(selectors.inventory.inventoryList)).toBeVisible();
    await expect(page.locator(selectors.inventory.footer)).toBeVisible();
  });

  test('TC015: All products display with details', async ({ page }) => {
    const products = page.locator(selectors.inventory.productItems);
    await products.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(products).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      const product = products.nth(i);
      await expect(product.locator('img')).toBeVisible();
      await expect(product.locator(selectors.inventory.productName)).not.toHaveText('');
      await expect(product.locator(selectors.inventory.productDescription)).not.toHaveText('');
      const priceText = await product.locator(selectors.inventory.productPrice).innerText();
      expect(priceText).toMatch(/^\$\d+(\.\d{2})?$/);
      await expect(product.locator(selectors.inventory.addToCartButton)).toBeVisible();
    }
  });

  test('TC016: Sorting by Price Low to High works', async ({ page }) => {
    await inventoryPage.clickSort('lohi');
    const prices = await inventoryPage.productPrices();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });

  test('TC017: Sorting by Price High to Low works', async ({ page }) => {
    await inventoryPage.clickSort('hilo');
    const prices = await inventoryPage.productPrices();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => b - a);
    expect(numericPrices).toEqual(sorted);
  });

  test('TC018: Sorting by Name A-Z works', async ({ page }) => {
    await inventoryPage.clickSort('az');
    const names = await inventoryPage.productNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('TC019: Sorting by Name Z-A works', async ({ page }) => {
    await inventoryPage.clickSort('za');
    const names = await inventoryPage.productNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('TC020: Add and remove products from cart', async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await inventoryPage.addProductToCartByIndex(0);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC021: Add multiple products updates cart badge correctly', async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.addProductToCartByIndex(1);
    await inventoryPage.addProductToCartByIndex(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });
});

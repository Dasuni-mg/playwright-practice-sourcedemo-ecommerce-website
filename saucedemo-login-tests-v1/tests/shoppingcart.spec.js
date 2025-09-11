// tests/cart.spec.js
const { test, expect } = require("@playwright/test");

test.describe("SauceDemo Shopping Cart Module", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("https://www.saucedemo.com/");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  // TC022: Add single item to cart
  test("TC022: Add single item to cart", async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toHaveCount(1);
    await expect(page.locator(".inventory_item_name")).toHaveText("Sauce Labs Backpack");
  });

  // TC023: Add multiple items to cart
  test("TC023: Add multiple items to cart", async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toHaveCount(2);
  });

  // TC024: Remove item from cart
  test("TC024: Remove item from cart", async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click(".shopping_cart_link");
    await page.click('button[data-test="remove-sauce-labs-backpack"]');
    await expect(page.locator(".cart_item")).toHaveCount(0);
  });

  // TC025: Cart persistence across pages
  test("TC025: Cart persistence across pages", async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toHaveCount(1);

    // Navigate back to inventory and then to cart again
    await page.click("#continue-shopping");
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toHaveCount(1);
  });

  // TC026: Empty cart handling
  test("TC026: Empty cart handling", async ({ page }) => {
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toHaveCount(0);
    await expect(page.locator(".cart_quantity_label")).toBeVisible();
  });

  // TC027: Cart quantity management
  test("TC027: Cart quantity management", async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click(".shopping_cart_link");
    const quantity = await page.locator(".cart_quantity").innerText();
    expect(quantity).toBe("1");
  });
});

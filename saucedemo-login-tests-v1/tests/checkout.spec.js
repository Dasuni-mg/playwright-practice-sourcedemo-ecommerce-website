const { test, expect } = require("@playwright/test");

test.describe("SauceDemo Checkout Process Tests", () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*inventory.html/);

    // Add 1 product to cart to start checkout
    await page.locator(".inventory_item").nth(0).locator("button").click();
    await page.locator(".shopping_cart_link").click();
    await expect(page).toHaveURL(/.*cart.html/);
  });

  // TC028: Complete checkout process
  test("TC028: Complete checkout process", async ({ page }) => {
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', "John");
    await page.fill('[data-test="lastName"]', "Doe");
    await page.fill('[data-test="postalCode"]', "12345");
    await page.click('[data-test="continue"]');

    // Verify checkout overview page
    await expect(page.locator(".summary_info")).toBeVisible();

    // Finish checkout
    await page.click('[data-test="finish"]');

    // Verify order confirmation (ignore case + punctuation)
    await expect(page.locator(".complete-header")).toHaveText(
      /thank you for your order!/i
    );
    await expect(page.locator(".complete-text")).toContainText("dispatched");
  });

  // TC029: Checkout form validation
  test("TC029: Checkout form validation", async ({ page }) => {
    await page.click('[data-test="checkout"]');

    // Try with empty fields
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText(
      /First Name is required/
    );

    // Fill only First Name
    await page.fill('[data-test="firstName"]', "John");
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText(
      /Last Name is required/
    );

    // Fill First + Last Name, leave Postal empty
    await page.fill('[data-test="lastName"]', "Doe");
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText(
      /Postal Code is required/
    );
  });

  // TC030: Checkout overview displays product and total
  test("TC030: Checkout overview displays product and total", async ({
    page,
  }) => {
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', "Alice");
    await page.fill('[data-test="lastName"]', "Smith");
    await page.fill('[data-test="postalCode"]', "11111");
    await page.click('[data-test="continue"]');

    // Verify product list is displayed
    await expect(page.locator(".cart_item")).toHaveCount(1);

    // Verify total price is shown
    const total = await page.locator(".summary_total_label").innerText();
    expect(total).toMatch(/Total:\s*\$\d+\.\d{2}/);
  });

  // TC031: Order confirmation page validation
  test("TC031: Order confirmation page validation", async ({ page }) => {
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', "Emma");
    await page.fill('[data-test="lastName"]', "Clark");
    await page.fill('[data-test="postalCode"]', "22222");
    await page.click('[data-test="continue"]');

    // Finish checkout
    await page.click('[data-test="finish"]');

    // Verify confirmation page
    await expect(page.locator(".complete-header")).toHaveText(
      /thank you for your order!/i
    );
    await expect(page.locator(".pony_express")).toBeVisible();

    // Back Home button works
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});

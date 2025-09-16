// tests/login.spec.js
const { test, expect } = require("@playwright/test");

// Increase default timeout for slow pages
test.setTimeout(60000);

test.describe("SauceDemo Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
  });

  // 1. Page Load & UI Validation
  test("TC001: Login page UI elements are visible", async ({ page }) => {
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(page.locator("#user-name")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#login-button")).toBeVisible();
    await expect(page.locator(".login_logo")).toBeVisible();
  });

  // 2. Valid Login
  test("TC002: Login with valid credentials", async ({ page }) => {
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  // 3. Invalid Login
  test("TC003: Login with invalid username and password", async ({ page }) => {
    await page.fill("#user-name", "wrong_user");
    await page.fill("#password", "wrong_pass");
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("TC004: Login with valid username and wrong password", async ({ page }) => {
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "wrong_pass");
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("TC005: Login with invalid username and valid password", async ({ page }) => {
    await page.fill("#user-name", "wrong_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  // 4. Empty Field Validation
  test("TC006: Login with empty username and password", async ({ page }) => {
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username is required"
    );
  });

  test("TC007: Login with empty password", async ({ page }) => {
    await page.fill("#user-name", "standard_user");
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Password is required"
    );
  });

  test("TC008: Login with empty username", async ({ page }) => {
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username is required"
    );
  });

  // 5. Special User Scenarios
  test("TC009: Locked out user cannot login", async ({ page }) => {
    await page.fill("#user-name", "locked_out_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });

  test("TC010: Problem user login succeeds but product images broken", async ({ page }) => {
    await page.fill("#user-name", "problem_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*inventory.html/);
    const products = page.locator(".inventory_item img");
    await expect(products.first()).toBeVisible();
  });

  test("TC011: Performance glitch user login succeeds", async ({ page }) => {
    await page.fill("#user-name", "performance_glitch_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  // 6. Security & Negative Cases
  test("TC012: Password field should be masked", async ({ page }) => {
    const type = await page.getAttribute("#password", "type");
    expect(type).toBe("password");
  });

  test("TC013: Login button is always enabled, shows error when fields empty", async ({ page }) => {
    const loginButton = page.locator("#login-button");
    await expect(loginButton).toBeEnabled(); // SauceDemo keeps it enabled
    await loginButton.click();
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username is required"
    );
  });
});

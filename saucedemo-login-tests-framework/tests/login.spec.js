// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

test.describe('SauceDemo Login Page Tests', () => {
  let loginPage, inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('TC001: Login page UI elements are visible', async () => {
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.logo).toBeVisible();
  });

  test('TC002: Login with valid credentials', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  test('TC003: Login with invalid username and password', async () => {
    await loginPage.login('wrong_user', 'wrong_pass');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC004: Login with valid username and wrong password', async () => {
    await loginPage.login('standard_user', 'wrong_pass');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC005: Login with invalid username and valid password', async () => {
    await loginPage.login('wrong_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC006: Login with empty username and password', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('TC007: Login with empty password', async () => {
    await loginPage.login('standard_user', '');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Password is required'
    );
  });

  test('TC008: Login with empty username', async () => {
    await loginPage.login('', 'secret_sauce');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('TC009: Locked out user cannot login', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC010: Problem user login succeeds but product images broken', async () => {
    await loginPage.login('problem_user', 'secret_sauce');
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    await expect(await inventoryPage.getFirstProductImage()).toBeVisible();
  });

  test('TC011: Performance glitch user login succeeds', async () => {
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  test('TC012: Password field should be masked', async ({ page }) => {
    const type = await page.getAttribute('#password', 'type');
    expect(type).toBe('password');
  });

  test('TC013: Login button is always enabled, shows error when fields empty', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required'
    );
  });
});

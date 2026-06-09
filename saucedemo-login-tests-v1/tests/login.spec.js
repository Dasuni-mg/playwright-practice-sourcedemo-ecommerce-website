// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../base/LoginPage');
const users = require('../data/users');

// Increase default timeout for slow pages
test.setTimeout(60000);

test.describe('SauceDemo Login Page Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('TC001: Login page UI elements are visible', async () => {
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.locator('#user-name')).toBeVisible();
    await expect(loginPage.locator('#password')).toBeVisible();
    await expect(loginPage.locator('#login-button')).toBeVisible();
    await expect(loginPage.locator('.login_logo')).toBeVisible();
  });

  test('TC002: Login with valid credentials', async () => {
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
  });

  test('TC003: Login with invalid username and password', async () => {
    await loginPage.login('wrong_user', 'wrong_pass');
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC004: Login with valid username and wrong password', async () => {
    await loginPage.login(users.standard_user.username, 'wrong_pass');
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC005: Login with invalid username and valid password', async () => {
    await loginPage.login('wrong_user', users.standard_user.password);
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC006: Login with empty username and password', async () => {
    await loginPage.click('#login-button');
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('TC007: Login with empty password', async () => {
    await loginPage.fill('#user-name', users.standard_user.username);
    await loginPage.click('#login-button');
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Password is required'
    );
  });

  test('TC008: Login with empty username', async () => {
    await loginPage.fill('#password', users.standard_user.password);
    await loginPage.click('#login-button');
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('TC009: Locked out user cannot login', async () => {
    await loginPage.login(users.locked_out_user.username, users.locked_out_user.password);
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC010: Problem user login succeeds but product images broken', async () => {
    await loginPage.login(users.problem_user.username, users.problem_user.password);
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
    const products = loginPage.page.locator('.inventory_item img');
    await expect(products.first()).toBeVisible();
  });

  test('TC011: Performance glitch user login succeeds', async () => {
    await loginPage.login(users.performance_glitch_user.username, users.performance_glitch_user.password);
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
    await expect(loginPage.page.locator('.inventory_list')).toBeVisible();
  });

  test('TC012: Password field should be masked', async () => {
    const type = await loginPage.getAttribute('#password', 'type');
    expect(type).toBe('password');
  });

  test('TC013: Login button is always enabled, shows error when fields empty', async () => {
    const loginButton = loginPage.locator('#login-button');
    await expect(loginButton).toBeEnabled();
    await loginButton.click();
    await expect(loginPage.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username is required'
    );
  });
});

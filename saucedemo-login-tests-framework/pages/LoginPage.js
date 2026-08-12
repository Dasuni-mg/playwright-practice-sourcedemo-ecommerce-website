// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator('#user-name');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.logo = page.locator('.login_logo');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  async login(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async getErrorText() {
    return this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };

const BasePage = require('./BasePage');
const selectors = require('../utils/selectors');

class LoginPage extends BasePage {
  async open() {
    await this.goto();
  }

  async login(username, password) {
    await this.fill(selectors.login.username, username);
    await this.fill(selectors.login.password, password);
    await this.click(selectors.login.submit);
  }

  async getErrorMessage() {
    return this.textContent(selectors.login.errorMessage);
  }

  async assertPageVisible() {
    await this.page.waitForSelector(selectors.login.username, { timeout: this.timeouts.action });
    await this.page.waitForSelector(selectors.login.password, { timeout: this.timeouts.action });
  }
}

module.exports = LoginPage;

const appConfig = require('../config/app.config');

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseURL = appConfig.baseURL;
    this.timeouts = appConfig.timeouts;
  }

  locator(selector) {
    return this.page.locator(selector);
  }

  async goto(path = '') {
    await this.page.goto(`${this.baseURL}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: this.timeouts.navigation,
    });
  }

  async click(selector) {
    await this.page.click(selector, { timeout: this.timeouts.action });
  }

  async fill(selector, text) {
    await this.page.fill(selector, text, { timeout: this.timeouts.action });
  }

  async textContent(selector) {
    return this.page.textContent(selector, { timeout: this.timeouts.action });
  }

  async getAttribute(selector, attribute) {
    return this.page.getAttribute(selector, attribute, { timeout: this.timeouts.action });
  }
}

module.exports = BasePage;

const BasePage = require('./BasePage');
const selectors = require('../utils/selectors');

class InventoryPage extends BasePage {
  async assertInventoryPage() {
    await this.page.waitForSelector(selectors.inventory.title, { timeout: this.timeouts.action });
  }

  async getProductCount() {
    return this.locator(selectors.inventory.productItems).count();
  }

  async clickSort(optionValue) {
    await this.page.selectOption(selectors.inventory.sortContainer, optionValue);
  }

  async addProductToCartByIndex(index) {
    await this.locator(selectors.inventory.productItems).nth(index).locator(selectors.inventory.addToCartButton).click({ timeout: this.timeouts.action });
  }

  async productPrices() {
    return this.locator(selectors.inventory.productPrice).allTextContents();
  }

  async productNames() {
    return this.locator(selectors.inventory.productName).allTextContents();
  }
}

module.exports = InventoryPage;

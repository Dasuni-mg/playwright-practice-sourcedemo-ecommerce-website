// pages/InventoryPage.js
class InventoryPage {
  constructor(page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.productImages = page.locator('.inventory_item img');
  }

  async isLoaded() {
    await this.page.waitForURL(/.*inventory.html/);
    return this.inventoryList.isVisible();
  }

  async getFirstProductImage() {
    return this.productImages.first();
  }
}

module.exports = { InventoryPage };

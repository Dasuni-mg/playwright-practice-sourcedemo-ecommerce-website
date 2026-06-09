const { expect } = require('@playwright/test');

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

async function expectButtonEnabled(page, selector) {
  const button = page.locator(selector);
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
}

module.exports = {
  formatPrice,
  expectButtonEnabled,
};

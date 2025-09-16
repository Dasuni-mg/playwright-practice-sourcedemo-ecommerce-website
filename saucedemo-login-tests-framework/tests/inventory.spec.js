const { test, expect } = require("@playwright/test");

test.describe("SauceDemo Inventory Page Tests", () => {
  // Login once before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/", { timeout: 60000 }); // 60s timeout
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  // 1. Page Load Validation
  test("TC014:Inventory page UI validation", async ({ page }) => {
    await expect(page).toHaveTitle("Swag Labs");
    await expect(page.locator(".title")).toBeVisible();
    await expect(page.locator(".app_logo")).toBeVisible();

    //check menu buttton visible and clickable
    const menuButton = page.locator("#react-burger-menu-btn");
    // Check if visible
    await expect(menuButton).toBeVisible();
    // Check if enabled (clickable)
    await expect(menuButton).toBeEnabled();

    //check cart link visible and clickable
    const cartLink = page.locator(".shopping_cart_link");
    // Check if visible
    await expect(cartLink).toBeVisible();
    // Check if enabled (clickable)
    await expect(cartLink).toBeEnabled();

    await expect(page.locator(".product_sort_container")).toBeVisible();
    await expect(page.locator(".inventory_list")).toBeVisible();
    await expect(page.locator(".footer")).toBeVisible();
  });

  // 2. Product Listing
  test("TC015:All products display with details", async ({ page }) => {
    const products = page.locator(".inventory_item");

    // Wait for products to appear
    await products.first().waitFor({ state: "visible", timeout: 10000 });

    await expect(products).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      const product = products.nth(i);

      //   Product image (not broken)
      await expect(product.locator("img")).toBeVisible();

      //   Product name (non-empty)
      await expect(product.locator(".inventory_item_name")).not.toHaveText("");

      //   Product description (non-empty)
      await expect(product.locator(".inventory_item_desc")).not.toHaveText("");

      //   Product price (formatted $XX.XX)
      const priceText = await product
        .locator(".inventory_item_price")
        .innerText();
      expect(priceText).toMatch(/^\$\d+(\.\d{2})?$/);

      //   Add to cart button
      await expect(product.locator(".btn_inventory ")).toBeVisible();
    }
  });

  //3. Sorting Tests
  //3.a Sorting by Price Low to High works
  test("TC016:Sorting by Price Low to High works", async ({ page }) => {
    await page.selectOption(".product_sort_container", "lohi");
    const prices = await page
      .locator(".inventory_item_price")
      .allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace("$", "")));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });

  //3.b Sorting by Price High to Low works
  test("TC017:Sorting by Price High to Low works", async ({ page }) => {
    await page.selectOption(".product_sort_container", "hilo");
    const prices = await page
      .locator(".inventory_item_price")
      .allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace("$", "")));
    const sorted = [...numericPrices].sort((a, b) => b - a);
    expect(numericPrices).toEqual(sorted);
  });

  //3.c Sorting by Name A-Z works
  test("TC018:Sorting by Name A-Z works", async ({ page }) => {
    await page.selectOption(".product_sort_container", "az");
    const names = await page.locator(".inventory_item_name").allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  //3.d Sorting by Name Z-A works
  test("TC019:Sorting by Name Z-A works", async ({ page }) => {
    await page.selectOption(".product_sort_container", "za");
    const names = await page.locator(".inventory_item_name").allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  //4.Add to cart
  test("TC020:Add and remove products from cart", async ({ page }) => {
    const addBtn = page.locator(".inventory_item").nth(0).locator("button");
    await addBtn.click();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    await addBtn.click(); // Should toggle to Remove
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
  });

  test("TC021:Add multiple products updates cart badge correctly", async ({
    page,
  }) => {
    const buttons = page.locator(".inventory_item button");
    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await buttons.nth(2).click();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("3");
  });
});

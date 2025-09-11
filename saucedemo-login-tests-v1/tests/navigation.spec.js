// tests/navigation.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Navigation Module', () => {

  test.beforeEach(async ({ page }) => {
    // Login and go to inventory page
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('TC032: Header navigation functionality', async ({ page }) => {
    const menuBtn = page.locator('#react-burger-menu-btn');
    const menuDrawer = page.locator('.bm-menu-wrap');

    // Open menu
    await menuBtn.click();
    await expect(menuDrawer).toBeVisible(); // wait until drawer is fully visible

    const allItems = page.locator('#inventory_sidebar_link');
    const aboutLink = page.locator('#about_sidebar_link');
    const resetLink = page.locator('#reset_sidebar_link');
    const logoutLink = page.locator('#logout_sidebar_link');

    // Verify all menu options visible
    await expect(allItems).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(resetLink).toBeVisible();
    await expect(logoutLink).toBeVisible();

    // ==== Menu Actions ====

    // 1. All Items → inventory page
    await allItems.click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // 2. About → opens external page
    await menuBtn.click(); // reopen menu
    await expect(menuDrawer).toBeVisible();
    const [aboutPage] = await Promise.all([
      page.waitForEvent('popup'),
      aboutLink.click()
    ]);
    await expect(aboutPage).toHaveURL(/saucelabs.com/);
    await aboutPage.close();

    // 3. Reset App State → stays on same page, clears any cart/badge
    await menuBtn.click();
    await expect(menuDrawer).toBeVisible();
    await resetLink.click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // 4. Logout → redirect to login
    await menuBtn.click();
    await expect(menuDrawer).toBeVisible();
    await logoutLink.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC033: Footer links validation', async ({ page }) => {
    const twitter = page.locator('.social_twitter');
    const facebook = page.locator('.social_facebook');
    const linkedin = page.locator('.social_linkedin');

    await expect(twitter).toBeVisible();
    await expect(facebook).toBeVisible();
    await expect(linkedin).toBeVisible();

    // Twitter → now X.com
    const [twitterPage] = await Promise.all([
      page.waitForEvent('popup'),
      twitter.click()
    ]);
    await expect(twitterPage).toHaveURL(/x.com/);
    await twitterPage.close();

    // Facebook
    const [fbPage] = await Promise.all([
      page.waitForEvent('popup'),
      facebook.click()
    ]);
    await expect(fbPage).toHaveURL(/facebook.com/);
    await fbPage.close();

    // LinkedIn
    const [linkedinPage] = await Promise.all([
      page.waitForEvent('popup'),
      linkedin.click()
    ]);
    await expect(linkedinPage).toHaveURL(/linkedin.com/);
    await linkedinPage.close();

    // Footer text visible
    await expect(page.locator('.footer_copy')).toBeVisible();
  });

});

# SauceDemo E2E Test Suite 🚀

This project contains end-to-end automated tests for the [SauceDemo](https://www.saucedemo.com/) e-commerce demo website.  
It is a **self-learning project** to practice **Playwright + JavaScript** for UI automation.

---

## 📌 Features & Test Scenarios

The test scripts cover major user flows and validations:

- 🔑 **Login & Authentication** – valid/invalid logins, error handling  
- 📦 **Inventory Page** – product listing, sorting (A–Z, Z–A, price low→high, high→low)  
- 🛒 **Shopping Cart** – add/remove items, cart badge, persistence across navigation  
- 💳 **Checkout Flow** – user info entry, order summary, successful completion  
- 🧭 **Navigation & Menu** – header menu, burger menu options, logout, reset app state  
- 📑 **Footer Links** – external social links (Twitter/X, Facebook, LinkedIn)  

---

## 🛠️ Tech Stack

- [Playwright](https://playwright.dev/) (JavaScript)  
- Cross-browser testing (**Chromium, Firefox, WebKit**)  
- HTML reports for test results  

---

## 📂 Project Structure

tests/
 ├── login.spec.js         # Login & authentication tests
 ├── inventory.spec.js     # Inventory listing & sorting tests
 ├── cart.spec.js          # Shopping cart tests
 ├── checkout.spec.js      # Checkout flow tests
 ├── navigation.spec.js    # Header menu & footer links


npx playwright show-report


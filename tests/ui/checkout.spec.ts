import { test, expect } from '../../fixtures/test';
import { customer } from '../../test-data/users';

const PRODUCTS = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage, checkoutPage, page }) => {
    for (const product of PRODUCTS) {
      await loggedIn.addToCart(product);
    }
    await loggedIn.openCart();
    await expect(cartPage.itemNames).toHaveCount(PRODUCTS.length);
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutPage.firstName).toBeEditable();
  });

  test('user completes an order end to end', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInfo(customer);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order total = item prices + tax', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(customer);
    await expect(checkoutPage.itemPrices).toHaveCount(PRODUCTS.length);

    const prices = (await checkoutPage.itemPrices.allTextContents()).map((p) => Number(p.replace('$', '')));
    const itemsSum = prices.reduce((sum, p) => sum + p, 0);
    const subtotal = await checkoutPage.getAmount(checkoutPage.subtotal);
    const tax = await checkoutPage.getAmount(checkoutPage.tax);
    const total = await checkoutPage.getAmount(checkoutPage.total);

    expect(subtotal).toBeCloseTo(itemsSum, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  const requiredFields = [
    { field: 'first name', data: { ...customer, firstName: '' }, message: 'Error: First Name is required' },
    { field: 'last name', data: { ...customer, lastName: '' }, message: 'Error: Last Name is required' },
    { field: 'postal code', data: { ...customer, postalCode: '' }, message: 'Error: Postal Code is required' },
  ];

  for (const { field, data, message } of requiredFields) {
    test(`validation: ${field} is required`, async ({ checkoutPage }) => {
      await checkoutPage.fillInfo(data);
      await expect(checkoutPage.error).toHaveText(message);
    });
  }
});

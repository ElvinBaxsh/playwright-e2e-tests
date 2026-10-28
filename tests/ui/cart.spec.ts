import { test, expect } from '../../fixtures/test';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart', () => {
  test('adding products updates the cart badge', async ({ loggedIn }) => {
    await loggedIn.addToCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.addToCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('removing a product from the list updates the badge', async ({ loggedIn }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.removeFromCart(BACKPACK);
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('cart shows the added products', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await loggedIn.openCart();
    await expect(cartPage.itemNames).toHaveText([BACKPACK, BIKE_LIGHT]);
  });

  test('product can be removed inside the cart', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await loggedIn.openCart();
    await cartPage.removeItem(BACKPACK);
    await expect(cartPage.itemNames).toHaveText([BIKE_LIGHT]);
  });

  test('cart items stay after page reload', async ({ loggedIn, cartPage, page }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.openCart();
    await page.reload();
    await expect(cartPage.itemNames).toHaveText([BACKPACK]);
  });
});

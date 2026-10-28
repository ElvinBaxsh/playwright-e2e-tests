import { test, expect } from '../../fixtures/test';

test.describe('Products', () => {
  test('shows 6 products', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
  });

  test('sort by name Z to A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by price low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('product details page opens from the list', async ({ loggedIn, page }) => {
    const name = 'Sauce Labs Backpack';
    await loggedIn.itemNames.filter({ hasText: name }).click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    await expect(page.getByTestId('back-to-products')).toBeVisible();
    await expect(page.getByTestId('inventory-item-name')).toHaveText([name]);
  });
});

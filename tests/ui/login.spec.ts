import { test, expect } from '../../fixtures/test';
import { users, PASSWORD } from '../../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);
    await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(users.standard, 'wrong_password');
    await loginPage.expectError('Epic sadface: Username and password do not match any user in this service');
  });

  const emptyFields = [
    { case: 'empty username', username: '', password: PASSWORD, message: 'Epic sadface: Username is required' },
    { case: 'empty password', username: users.standard, password: '', message: 'Epic sadface: Password is required' },
  ];

  for (const data of emptyFields) {
    test(`validation: ${data.case}`, async ({ loginPage }) => {
      await loginPage.login(data.username, data.password);
      await loginPage.expectError(data.message);
    });
  }

  test('inventory page is not reachable without login', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await loginPage.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });

  test('user can log out', async ({ loggedIn, page, loginPage }) => {
    await loggedIn.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});

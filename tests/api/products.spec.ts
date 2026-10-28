import { test, expect, APIResponse } from '@playwright/test';

// This API always returns HTTP 200; the real status is in the "responseCode" field of the body.
async function body(response: APIResponse) {
  expect(response.ok()).toBeTruthy();
  return JSON.parse(await response.text());
}

test.describe('Products API', () => {
  test('GET /api/productsList returns all products', async ({ request }) => {
    const data = await body(await request.get('/api/productsList'));
    expect(data.responseCode).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
    for (const product of data.products) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.stringMatching(/^Rs\. \d+$/),
          brand: expect.any(String),
          category: expect.objectContaining({ category: expect.any(String) }),
        }),
      );
    }
  });

  test('POST /api/productsList is not supported', async ({ request }) => {
    const data = await body(await request.post('/api/productsList'));
    expect(data.responseCode).toBe(405);
    expect(data.message).toBe('This request method is not supported.');
  });

  test('GET /api/brandsList returns brands', async ({ request }) => {
    const data = await body(await request.get('/api/brandsList'));
    expect(data.responseCode).toBe(200);
    expect(data.brands.length).toBeGreaterThan(0);
    expect(data.brands[0]).toEqual(expect.objectContaining({ id: expect.any(Number), brand: expect.any(String) }));
  });

  test('POST /api/searchProduct finds matching products', async ({ request }) => {
    const data = await body(await request.post('/api/searchProduct', { form: { search_product: 'top' } }));
    expect(data.responseCode).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
    for (const product of data.products) {
      expect(`${product.name} ${product.category.category}`.toLowerCase()).toContain('top');
    }
  });

  test('POST /api/searchProduct without parameter returns 400', async ({ request }) => {
    const data = await body(await request.post('/api/searchProduct'));
    expect(data.responseCode).toBe(400);
    expect(data.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});

test.describe('Account API', () => {
  test('POST /api/verifyLogin with unknown user returns 404', async ({ request }) => {
    const data = await body(
      await request.post('/api/verifyLogin', { form: { email: 'no-such-user@example.com', password: 'wrong' } }),
    );
    expect(data.responseCode).toBe(404);
    expect(data.message).toBe('User not found!');
  });

  test('POST /api/verifyLogin without email returns 400', async ({ request }) => {
    const data = await body(await request.post('/api/verifyLogin', { form: { password: 'wrong' } }));
    expect(data.responseCode).toBe(400);
    expect(data.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  test('DELETE /api/verifyLogin is not supported', async ({ request }) => {
    const data = await body(await request.delete('/api/verifyLogin'));
    expect(data.responseCode).toBe(405);
    expect(data.message).toBe('This request method is not supported.');
  });
});

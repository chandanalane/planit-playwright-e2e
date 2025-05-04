import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { retry } from '../lib/utils';

test('Test Case 3 - Shopping Cart Validation', async ({ page }) => {
  const home = new HomePage(page);
  const shop = new ShopPage(page);

  await test.step('Navigate to Home Page and go to Shop', async () => {
    await home.navigate();
    await home.goToShopPage();
  });

  await test.step('Add multiple items to cart', async () => {
    await retry(() => shop.addItemToCart('Stuffed Frog', 2), 'Add Stuffed Frog');
    await retry(() => shop.addItemToCart('Fluffy Bunny', 5), 'Add Fluffy Bunny');
    await retry(() => shop.addItemToCart('Valentine Bear', 3), 'Add Valentine Bear');
  });

  await test.step('Go to Cart Page', async () => {
    await home.goToCartPage();
  });

  await test.step('Verify each product details and prices', async () => {
    await shop.verifyProductDetails('Stuffed Frog', 10.99, 2);
    await shop.verifyProductDetails('Fluffy Bunny', 9.99, 5);
    await shop.verifyProductDetails('Valentine Bear', 14.99, 3);
  });

  await test.step('Verify total amount in cart matches expected sum', async () => {
    await shop.verifyTotalSum();
  });
});

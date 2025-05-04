import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { retry } from '../lib/utils'; 

test('Test Case 3 - Shopping Cart Validation', async ({ page }) => {
  const home = new HomePage(page);
  const shop = new ShopPage(page);

  console.log('Navigating to home page...');
  await home.navigate();

  console.log('Going to Shop page...');
  await home.goToShopPage();

  console.log('Adding items to cart...');
  await retry(() => shop.addItemToCart('Stuffed Frog', 2), 'Stuffed Frog');
  await retry(() => shop.addItemToCart('Fluffy Bunny', 5), 'Fluffy Bunny');
  await retry(() => shop.addItemToCart('Valentine Bear', 3), 'Valentine Bear');



  console.log('Navigating to Cart page...');
  await home.goToCartPage();

  console.log('Verifying product details...');
  await shop.verifyProductDetails('Stuffed Frog', 10.99, 2);
  await shop.verifyProductDetails('Fluffy Bunny', 9.99, 5);
  await shop.verifyProductDetails('Valentine Bear', 14.99, 3);

  console.log('Verifying total sum...');
  await shop.verifyTotalSum();
});



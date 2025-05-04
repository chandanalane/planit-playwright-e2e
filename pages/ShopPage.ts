import { Page, expect,test } from '@playwright/test';
import { retry } from '../lib/utils';

/**
 * Page Object Model for the Shop Page
 */
export class ShopPage {
  constructor(private page: Page) {}

  /**
   * Adds an item to cart multiple times
   * @param productName - Name of the product
   * @param quantity - Number of times to click "Buy"
   */
  async addItemToCart(productName: string, quantity: number) {
    const product = this.page.locator('.product', { hasText: productName });

    for (let i = 0; i < quantity; i++) {
      await retry(() => product.locator('text=Buy').first().click(), `Buy ${productName} [${i + 1}]`);
    }
  }

  /** Navigates to the Cart page */
  async goToCart() {
    await retry(() => this.page.getByRole('link', { name: 'Cart' }).click(), 'Click Cart link');
  }

  /**
   * Verifies product details in cart
   * @param name - Product name
   * @param expectedPrice - Expected unit price
   * @param expectedQuantity - Quantity added
   */
  async verifyProductDetails(name: string, expectedPrice: number, expectedQuantity: number) {
    const row = this.page.locator('tr', { hasText: name });

    await retry(async () => {
      await expect(row.locator('td:nth-child(2)')).toBeVisible({ timeout: 5000 });
      await expect(row.locator('td:nth-child(4)')).toBeVisible({ timeout: 5000 });
    }, `Wait for product row: ${name}`);

    const priceText = await row.locator('td:nth-child(2)').textContent();
    const subtotalText = await row.locator('td:nth-child(4)').textContent();

    test.info().attach('unit-price-debug', { body: Buffer.from(`${name} -> ${priceText}`), contentType: 'text/plain' });
    test.info().attach('subtotal-debug', { body: Buffer.from(`${name} -> ${subtotalText}`), contentType: 'text/plain' });

    const unitPrice = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
    const subtotal = parseFloat(subtotalText?.replace(/[^\d.]/g, '') || '0');

    expect(unitPrice).toBeCloseTo(expectedPrice, 2);
    expect(subtotal).toBeCloseTo(expectedPrice * expectedQuantity, 2);
  }

  /** Verifies the total sum matches the subtotal of all items */
  async verifyTotalSum() {
    const prices = await this.page.locator('tr td:nth-child(4)').allTextContents();
    const expectedTotal = prices
      .map(p => parseFloat(p.replace(/[^\d.]/g, '')))
      .reduce((a, b) => a + b, 0);

    const totalLocator = this.page.locator('strong.total');
    await retry(() => expect(totalLocator).toBeVisible({ timeout: 5000 }), 'Check total visibility');

    const totalText = await totalLocator.textContent();

    test.info().attach('calculated-total', {
      body: Buffer.from(`Expected total: ${expectedTotal}, Shown total: ${totalText}`),
      contentType: 'text/plain'
    });

    const total = parseFloat(totalText?.replace(/[^\d.]/g, '') || '0');
    expect(total).toBeCloseTo(expectedTotal, 2);
  }
}

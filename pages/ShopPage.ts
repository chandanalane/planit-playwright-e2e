import { Page, expect } from '@playwright/test';

export class ShopPage {
  constructor(private page: Page) {}

  async addItemToCart(productName: string, quantity: number) {
    const product = this.page.locator('.product').filter({ hasText: productName });
  
    for (let i = 0; i < quantity; i++) {
      await product.locator('text=Buy').first().click();
    }
  }
  

  async goToCart() {
    await this.page.getByRole('link', { name: 'Cart' }).click();
  }

  async verifyProductDetails(name: string, expectedPrice: number, expectedQuantity: number) {
    const row = this.page.locator('tr', { hasText: name });
  
    // Wait for row to appear and all necessary cells to be visible
    await expect(row.locator('td:nth-child(2)')).toBeVisible({ timeout: 5000 });
    await expect(row.locator('td:nth-child(4)')).toBeVisible({ timeout: 5000 });
  
    const priceText = await row.locator('td:nth-child(2)').textContent();
    const subtotalText = await row.locator('td:nth-child(4)').textContent();
  
    console.log(`DEBUG for ${name} -> Unit Price Text: ${priceText}, Subtotal Text: ${subtotalText}`);
  
    const unitPrice = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
    const subtotal = parseFloat(subtotalText?.replace(/[^\d.]/g, '') || '0');
  
    expect(unitPrice).toBeCloseTo(expectedPrice, 2);
    expect(subtotal).toBeCloseTo(expectedPrice * expectedQuantity, 2);
  }
  
  async verifyTotalSum() {
    console.log('Verifying total sum...');
  
    // Get all subtotal values
    const prices = await this.page.locator('tr td:nth-child(4)').allTextContents();
    const expectedTotal = prices
      .map(p => parseFloat(p.replace(/[^\d.]/g, '')))
      .reduce((a, b) => a + b, 0);
  
    // Locate the <strong> tag with class "total"
    const totalLocator = this.page.locator('strong.total');
    await expect(totalLocator).toBeVisible({ timeout: 5000 });
  
    const totalText = await totalLocator.textContent();
    console.log(`DEBUG Total Text: ${totalText}`);
  
    const total = parseFloat(totalText?.replace(/[^\d.]/g, '') || '0');
    expect(total).toBeCloseTo(expectedTotal, 2);
  }

  
}

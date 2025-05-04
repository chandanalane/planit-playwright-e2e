import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async goToContactPage() {
    await this.page.getByRole('link', { name: 'Contact' }).click();
  }

  async goToShopPage() {
   await this.page.click('text=Shop');
  }

  async goToCartPage() {
    await this.page.getByRole('link', { name: /cart/i }).click();
    await this.page.waitForURL('**/cart'); // wait until navigation is done
    await this.page.waitForSelector('text=Total'); 
  }
  
}
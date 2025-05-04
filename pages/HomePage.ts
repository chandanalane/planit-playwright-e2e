import { Page } from '@playwright/test';
import { retry } from '../lib/utils';

/**
 * Page Object Model for the Home Page.
 */
export class HomePage {
  constructor(private page: Page) {}

  /**
   * Navigates to the root URL.
   */
  async navigate() {
    await retry(() => this.page.goto('/'), 'Navigate to Home');
  }

  /**
   * Navigates to the Contact page via top navigation.
   */
  async goToContactPage() {
    await retry(() => this.page.getByRole('link', { name: 'Contact' }).click(), 'Navigate to Contact Page');
  }

  /**
   * Navigates to the Shop page.
   */
  async goToShopPage() {
    await retry(() => this.page.click('text=Shop'), 'Navigate to Shop Page');
  }

  /**
   * Navigates to the Cart page and waits for page and element to load.
   */
  async goToCartPage() {
    await retry(() => this.page.getByRole('link', { name: /cart/i }).click(), 'Navigate to Cart Page');

    await retry(() => this.page.waitForURL('**/cart'), 'Wait for Cart Page URL');
    await retry(() => this.page.waitForSelector('text=Total'), 'Wait for Total text on Cart Page');
  }
}

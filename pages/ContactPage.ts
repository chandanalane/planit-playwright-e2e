import { Page, expect, Locator } from '@playwright/test';
import { retry } from '../lib/utils';

/**
 * Page Object Model for the Contact Page
 */
export class ContactPage {
  constructor(private page: Page) {}

  /** Clicks the Submit button with retry */
  async clickSubmit() {
    await retry(() => this.page.click('text=Submit'), 'Click Submit');
  }

  /** Clicks the Back button with retry */
  async clickBack() {
    await retry(() => this.page.click('text=« Back'), 'Click Back');
  }

  /**
   * Fills mandatory fields in the contact form
   * @param forename - User’s first name
   * @param email - User’s email
   * @param message - Feedback message
   */
  async fillMandatoryFields({ forename, email, message }: { forename: string, email: string, message: string }) {
    await retry(async () => {
      await this.page.getByLabel('Forename').fill(forename);
      await this.page.getByLabel('Email').fill(email);
      await this.page.getByLabel('Message').fill(message);
    }, 'Fill mandatory fields');
  }

  /**
   * Waits for an element to become visible
   * @param locator - Element locator
   * @param label - Description for reporting
   */
  async waitForElement(locator: Locator, label: string) {
    await retry(() => locator.waitFor({ state: 'visible', timeout: 5000 }), `Wait for element: ${label}`);
  }

  /** Asserts that error messages for required fields are visible */
  async expectErrorMessages() {
    await this.waitForElement(this.page.locator('text=Forename is required'), 'Forename error message');
    await this.waitForElement(this.page.locator('text=Email is required'), 'Email error message');
    await this.waitForElement(this.page.locator('text=Message is required'), 'Message error message');
  }

  /** Asserts that there are no error messages on the form */
  async expectNoErrorMessages() {
    await retry(() => expect(this.page.locator('.alert-error')).toHaveCount(0), 'No error messages');
  }

  /** Verifies the success message is shown */
  async expectSuccessMessage() {
    const successLocator = this.page.locator('.alert-success');
    const expectedText = /we appreciate your feedback/i;

    await this.waitForElement(successLocator, 'Success message');
    await retry(() => expect(successLocator).toHaveText(expectedText, { timeout: 5000 }), 'Verify success message text');
  }

  /** Waits for modal dialog completion (progress bar to 100%) */
  async waitForModalToComplete() {
    const modal = this.page.locator('.popup.modal');
    const progressBar = modal.locator('.progress .bar');

    await this.waitForElement(modal, 'Modal dialog');

    await retry(async () => {
      await this.page.waitForFunction(() => {
        const el = document.querySelector('.popup.modal .progress .bar');
        return el && el instanceof HTMLElement && el.style.width === '100%';
      });
    }, 'Wait for progress bar to reach 100%');
    
  }
}

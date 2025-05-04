import { Page, expect } from '@playwright/test';

export class ContactPage {
  constructor(private page: Page) {}

  // Retry logic for element interactions
  private async retryElementInteraction(
    fn: () => Promise<void>,
    label: string,
    retries = 3,
    delayMs = 1000
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempt ${i + 1} for: ${label}`);
        await fn();
        return;
      } catch (error) {
        console.warn(`Failed attempt ${i + 1} for ${label}:`, error.message);
        if (i === retries - 1) throw error;
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  async clickSubmit() {
    await this.retryElementInteraction(
      async () => await this.page.click('text=Submit'),
      'Click Submit'
    );
  }

  async clickBack() {
    await this.retryElementInteraction(
      async () => await this.page.click('text=« Back'),
      'Click Back'
    );
  }

  async fillMandatoryFields({ forename, email, message }: { forename: string, email: string, message: string }) {
    await this.retryElementInteraction(
      async () => {
        await this.page.getByLabel('Forename').fill(forename);
        await this.page.getByLabel('Email').fill(email);
        await this.page.getByLabel('Message').fill(message);
      },
      'Fill mandatory fields'
    );
  }

  // Waiting for an element to be visible with retry logic
  async waitForElement(locator: any, label: string, retries = 3, delayMs = 1000) {
    await this.retryElementInteraction(
      async () => await locator.waitFor({ state: 'visible', timeout: 5000 }),
      `Wait for element: ${label}`,
      retries,
      delayMs
    );
  }

  async expectErrorMessages() {
    await this.waitForElement(this.page.locator('text=Forename is required'), 'Forename error message');
    await this.waitForElement(this.page.locator('text=Email is required'), 'Email error message');
    await this.waitForElement(this.page.locator('text=Message is required'), 'Message error message');
  }

  async expectNoErrorMessages() {
    const errorLocator = this.page.locator('.alert-error');
    await this.retryElementInteraction(
      async () => await expect(errorLocator).toHaveCount(0),
      'No error messages'
    );
  }

  async expectSuccessMessage() {
    const successMessageLocator = this.page.locator('.alert-success');
    const expectedText = /we appreciate your feedback/i;

    // Use retry logic for waiting for the success message
    await this.waitForElement(successMessageLocator, 'Success message', 3, 1000);
    await this.retryElementInteraction(
      async () => await expect(successMessageLocator).toHaveText(expectedText, { timeout: 5000 }),
      'Success message text verification'
    );
  }

  // Wait for the modal dialog to complete with retry logic
  async waitForModalToComplete() {
    const modalLocator = this.page.locator('.popup.modal');
    const progressBarLocator = modalLocator.locator('.progress .bar');

    // Wait for the modal to appear
    await this.waitForElement(modalLocator, 'Modal dialog');

    // Wait until the progress bar reaches 100%
    await this.retryElementInteraction(
      async () => await this.page.waitForFunction(
        (progressBar) => progressBar.style.width === '100%',
        {},
        progressBarLocator
      ),
      'Wait for progress bar to reach 100%'
    );

    // Optionally wait for the modal to disappear (if applicable)
    await this.waitForElement(modalLocator, 'Modal dialog disappearance');
  }
}

import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import { retry } from '../lib/utils';

test.describe('Contact Form Tests', () => {
  let home: HomePage;
  let contact: ContactPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    contact = new ContactPage(page);
    await home.navigate();
    await home.goToContactPage();
  });

  test('Test Case 1 - Error validation and field completion', async () => {
    await retry(async () => {
      await contact.clickSubmit();
    }, 'Click Submit');

    await retry(async () => {
      await contact.expectErrorMessages();
    }, 'Expect error messages');

    // Fill mandatory fields and validate
    await retry(async () => {
      await contact.fillMandatoryFields({
        forename: 'Chandana',
        email: 'chandana@gmail.com',
        message: 'Hello',
      });
    }, 'Fill mandatory fields');

    await retry(async () => {
      await contact.expectNoErrorMessages();
    }, 'Expect no error messages');
  });

  test('Test Case 2 - Successful submission', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await retry(async () => {
        await home.goToContactPage();
      }, `Go to Contact Page ${i + 1}`);

      await retry(async () => {
        await contact.fillMandatoryFields({
          forename: `Chandana${i}`,
          email: `Chandana${i}@gmail.com`,
          message: 'Hello',
        });
      }, `Fill mandatory fields ${i + 1}`);

      await retry(async () => {
        await contact.clickSubmit();
      }, `Click Submit ${i + 1}`);

      // Wait for success message
      await retry(async () => {
        await contact.expectSuccessMessage();
      }, `Expect success message ${i + 1}`);

      // Go back after successful submission
      await retry(async () => {
        await contact.clickBack();
      }, `Click Back ${i + 1}`);
    }
  });
});

import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import { retry } from '../lib/utils';

const env = process.env.TEST_ENV || 'staging';
const contactData = require(`./data/contactFormData.${env}.json`);

test.describe('Contact Form Tests', () => {
  let home: HomePage;
  let contact: ContactPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    contact = new ContactPage(page);
    await test.step('Navigate to home page', async () => {
      await home.navigate();
    });
    await test.step('Go to Contact Page', async () => {
      await home.goToContactPage();
    });
  });

  test('Test Case 1 - Error validation and field completion', async () => {
    await test.step('Click Submit button', async () => {
      await retry(() => contact.clickSubmit(), 'Click Submit');
    });

    await test.step('Expect error messages for missing fields', async () => {
      await retry(() => contact.expectErrorMessages(), 'Expect error messages');
    });

    await test.step('Fill mandatory fields with valid data', async () => {
      await retry(() => contact.fillMandatoryFields(contactData.validContact), 'Fill mandatory fields');
    });

    await test.step('Verify no error messages after filling fields', async () => {
      await retry(() => contact.expectNoErrorMessages(), 'Expect no error messages');
    });
  });

  test('Test Case 2 - Successful submission', async () => {
    for (let i = 0; i < contactData.bulkContacts.length; i++) {
      const data = contactData.bulkContacts[i];

      await test.step(`Go to Contact Page for submission ${i + 1}`, async () => {
        await retry(() => home.goToContactPage(), `Go to Contact Page ${i + 1}`);
      });

      await test.step(`Fill mandatory fields for contact ${i + 1}`, async () => {
        await retry(() => contact.fillMandatoryFields(data), `Fill mandatory fields ${i + 1}`);
      });

      await test.step(`Click Submit for contact ${i + 1}`, async () => {
        await retry(() => contact.clickSubmit(), `Click Submit ${i + 1}`);
      });

      await test.step(`Expect success message for contact ${i + 1}`, async () => {
        await retry(() => contact.expectSuccessMessage(), `Expect success message ${i + 1}`);
      });

      await test.step(`Click Back after successful submission for contact ${i + 1}`, async () => {
        await retry(() => contact.clickBack(), `Click Back ${i + 1}`);
      });
    }
  });
});

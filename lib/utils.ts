import { test } from '@playwright/test';

/**
 * Retry a given asynchronous function multiple times with delay.
 * Attaches retry attempts to the Playwright test report.
 *
 * @param fn - Async function to retry
 * @param label - Label for the action
 * @param retries - Number of attempts (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 */
export async function retry<T>(fn: () => Promise<T>, label: string, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`⚠️ Failed attempt ${i + 1} for ${label}: ${(error as Error).message}`);
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error(`All ${retries} retries failed for: ${label}`);
}

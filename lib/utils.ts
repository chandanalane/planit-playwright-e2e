export async function retry(fn: () => Promise<void>, label: string, retries = 3, delayMs = 1000) {
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
  
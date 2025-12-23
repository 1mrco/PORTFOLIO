import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display contact form', async ({ page }) => {
    // Scroll to contact form
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    // Check form elements are visible
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-subject')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error messages for empty fields', async ({ page }) => {
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    // Wait for form to be ready
    await page.waitForSelector('#contact-form');
    
    // Remove required attributes to test JS validation
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('#contact-form [required]');
      inputs.forEach((input) => input.removeAttribute('required'));
    });
    
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // Wait for JS validation to run and error messages to appear
    await page.waitForTimeout(300);
    
    // Check for error messages
    await expect(page.locator('#name-error')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#email-error')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#subject-error')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#message-error')).toBeVisible({ timeout: 2000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    // Wait for form to be ready
    await page.waitForSelector('#contact-form');
    
    // Remove required attributes to test JS validation
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('#contact-form [required]');
      inputs.forEach((input) => input.removeAttribute('required'));
    });
    
    // Fill form with invalid email
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('invalid-email');
    await page.locator('#contact-subject').fill('Test Subject');
    await page.locator('#contact-message').fill('Test message');
    
    await page.locator('button[type="submit"]').click();
    
    // Wait for JS validation to run
    await page.waitForTimeout(300);
    
    // Check for email validation error
    await expect(page.locator('#email-error')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#email-error')).toContainText('valid email');
  });

  test('should clear errors when user types', async ({ page }) => {
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    // Wait for form to be ready
    await page.waitForSelector('#contact-form');
    
    // Remove required attributes to test JS validation
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('#contact-form [required]');
      inputs.forEach((input) => input.removeAttribute('required'));
    });
    
    // Submit empty form to trigger errors
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#name-error')).toBeVisible({ timeout: 2000 });
    
    // Start typing in name field
    await page.locator('#contact-name').fill('T');
    await page.waitForTimeout(100);
    
    // Error should be cleared
    await expect(page.locator('#name-error')).not.toBeVisible();
  });

  test('should show loading state when submitting', async ({ page }) => {
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    // Fill form with valid data
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('test@example.com');
    await page.locator('#contact-subject').fill('Test Subject');
    await page.locator('#contact-message').fill('Test message content');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check loading state (button should be disabled)
    await expect(submitButton).toBeDisabled();
    
    // Check for loading text
    await expect(page.locator('.btn-loading')).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    await expect(page.locator('label[for="contact-name"]')).toContainText('Your Name');
    await expect(page.locator('label[for="contact-email"]')).toContainText('Your Email');
    await expect(page.locator('label[for="contact-subject"]')).toContainText('Subject');
    await expect(page.locator('label[for="contact-message"]')).toContainText('Message');
  });

  test('should have required attributes on form fields', async ({ page }) => {
    await page.locator('.contact-section').scrollIntoViewIfNeeded();
    
    await expect(page.locator('#contact-name')).toHaveAttribute('required');
    await expect(page.locator('#contact-email')).toHaveAttribute('required');
    await expect(page.locator('#contact-subject')).toHaveAttribute('required');
    await expect(page.locator('#contact-message')).toHaveAttribute('required');
  });
});


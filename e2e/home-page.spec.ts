import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home/);
  });

  test('should display hero section with profile image', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero-title')).toContainText('Talib Arkan Talib');
    await expect(page.locator('.profile-image')).toBeVisible();
  });

  test('should display navigation links', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('.nav-link[href="/"]')).toBeVisible();
    await expect(page.locator('.nav-link[href="/projects"]')).toBeVisible();
    await expect(page.locator('.nav-link[href="/certificates"]')).toBeVisible();
    await expect(page.locator('.nav-link[href="/games"]')).toBeVisible();
  });

  test('should display CV sections', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to about section
    await page.locator('.about-preview').scrollIntoViewIfNeeded();
    
    await expect(page.locator('.cv-section')).toHaveCount(7); // Personal Info, Career Objective, Academic, Technical Skills, Soft Skills, Work Experience, Languages
  });

  test('should display footer with contact icons', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('.footer-icon[href*="mailto"]')).toBeVisible();
    await expect(page.locator('.footer-icon[href*="tel:"]')).toBeVisible();
    await expect(page.locator('.footer-icon[href*="linkedin"]')).toBeVisible();
    await expect(page.locator('.footer-icon[href*="instagram"]')).toBeVisible();
  });

  test('should have correct footer contact information', async ({ page }) => {
    await page.goto('/');
    
    const emailLink = page.locator('.footer-icon[href*="mailto"]');
    await expect(emailLink).toHaveAttribute('href', /talb\.arkan2003@gmail\.com/);
    
    const phoneLink = page.locator('.footer-icon[href*="tel:"]');
    await expect(phoneLink).toHaveAttribute('href', /07719215943/);
  });
});


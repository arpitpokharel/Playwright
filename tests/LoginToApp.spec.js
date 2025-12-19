import { test, expect } from '@playwright/test';
import { LoginPage } from '../Templates/LoginPage';

test('login to application', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.login();
});

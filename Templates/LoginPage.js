import { test, expect } from '@playwright/test';
exports.LoginPage=
class {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator("//input[@name='username']");
        this.passwordInput = page.locator("//input[@name='password']");
        this.loginButton = page.locator("//button[@type='submit']");
        this.dashboardHeader = page.locator("//h6[text()='Dashboard']");
    }

    async goToLoginPage() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/');
    }

    async login(username = 'Admin', password = 'admin123') {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await expect(this.dashboardHeader).toBeVisible();
    }

}
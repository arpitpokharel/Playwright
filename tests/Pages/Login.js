import { FailureHandling } from '../../Templates/FailureHandling.js';
import * as Locators from '../../Locators/Index.js';

export default class LoginPage {
    constructor(web) {
        this.web = web;
        this.loginLocators = Locators.LoginPageLocators;
    }

    async navigateToLogin(url) {
        await this.web.navigate(url, 30000);
    }

    async login(username, password) {
        await this.web.setText(this.loginLocators.username, username);
        await this.web.setText(this.loginLocators.password, password);
        await this.web.click(this.loginLocators.loginButton);
    }

    async verifyDashboardVisible() {
        await this.web.verifyElementVisible(this.loginLocators.dashboardLabel);
    }

    async verifyErrorMessage(expectedText) {
        const actualText = await this.web.getText(this.loginLocators.errorMessage);
        await this.web.verifyEqual(expectedText, actualText, FailureHandling.CONTINUE_ON_FAILURE);
    }
}

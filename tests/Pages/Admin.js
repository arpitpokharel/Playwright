import { FailureHandling } from '../../Templates/FailureHandling.js';
import * as Locators from '../../Locators/Index.js';

export default class AdminPage {
    constructor(web) {
        this.web = web;
        this.menuLocators = Locators.MainMenuLocators;
        this.adminLocators = Locators.AdminPageLocators;
    }

    async enterAdminPage() {
        await this.web.click(this.menuLocators.admin);

        await this.web.verifyElementPresent(
            this.adminLocators.systemUsersHeader,
            FailureHandling.STOP_ON_FAILURE
        );
    }
}
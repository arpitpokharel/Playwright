import '../Templates/GlobalVariables.js';
import { test as base } from '@playwright/test';
import WebActions from './WebActions.js';

export const test = base.extend({
    web: async ({ page }, use) => {
        // set default timeouts from Playwright config
        page._actionTimeout = page.context()._options.actionTimeout ?? 5000;
        page._expectTimeout = page.context()._options.expect?.timeout ?? 5000;

        await use(new WebActions(page));
    },
});

export { expect } from '@playwright/test';

import { test, expect } from '@playwright/test';
import BaseKeyword from './BaseKeyword.js';
import { FailureHandling } from './FailureHandling.js';
import ExcelUtil from '../Excel/ExcelUtil.js';


export default class WebActions extends BaseKeyword {
    constructor(page) {
        super(page);
    }

    //Browswer Actions Starts

    async navigate(url, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Navigate to "${url}"`, async () => {
            try {
                await this.page.goto(url, { timeout: this.resolveActionTimeout(timeout) });
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async refresh(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Refresh page`, async () => {
            try {
                await this.page.reload();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async back(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Navigate back`, async () => {
            try {
                await this.page.goBack();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async forward(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Navigate forward`, async () => {
            try {
                await this.page.goForward();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async switchToWindowIndex(index, failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Switch to window index ${index}`, async () => {
            try {
                const pages = this.page.context().pages();
                if (index < 0 || index >= pages.length) {
                    throw new Error(`Invalid window index: ${index}`);
                }
                await pages[index].bringToFront();
                this.page = pages[index]; 
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async switchToDefaultContent(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Switch to default content`, async () => {
            try {
                this.page = this.page.mainFrame().page();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async switchToFrame(frameSelectorOrName, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Switch to frame "${frameSelectorOrName}"`, async () => {
            try {
                let frame;
                // if selector provided, locate frame element
                const frameElement = this.page.locator(frameSelectorOrName);
                if (await frameElement.count() > 0) {
                    await frameElement.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                    frame = await frameElement.elementHandle().then(el => el.contentFrame());
                } else {
                    // try by frame name
                    frame = this.page.frame({ name: frameSelectorOrName });
                }

                if (!frame) throw new Error(`Frame "${frameSelectorOrName}" not found`);

                this.page = frame.page(); // update current page/frame reference
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    //Browswer Actions Ends

    //Elemnent Actions
    async click(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Click "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.click();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async doubleClick(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Double click "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.dblclick();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async rightClick(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Right click "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.click({ button: 'right' });
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async setText(selector, text, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Set text "${text}" in "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.fill(text);
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async clearText(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Clear text in "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.fill('');
                const value = await locator.inputValue();

                if (value !== '') {
                    await locator.focus();
                    const selectAllKey = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
                    await this.page.keyboard.press(selectAllKey);
                    await this.page.keyboard.press('Backspace');
                }
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async uploadFile(selector, filePath, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Upload file "${filePath}" to "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.setInputFiles(filePath);
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async hover(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Hover over "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await locator.hover();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async check(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Check "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                if (!(await locator.isChecked())) {
                    await locator.check();
                }
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }
    async uncheck(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Uncheck "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                if (await locator.isChecked()) {
                    await locator.uncheck();
                }
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async dragAndDrop(sourceSelector, targetSelector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Drag and drop "${sourceSelector}" to "${targetSelector}"`, async () => {
            try {
                const source = this.page.locator(sourceSelector);
                const target = this.page.locator(targetSelector);

                await source.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                await target.waitFor({ timeout: this.resolveActionTimeout(timeout) });

                const sourceBox = await source.boundingBox();
                const targetBox = await target.boundingBox();

                if (sourceBox && targetBox) {
                    await this.page.mouse.move(
                        sourceBox.x + sourceBox.width / 2,
                        sourceBox.y + sourceBox.height / 2
                    );
                    await this.page.mouse.down();
                    await this.page.mouse.move(
                        targetBox.x + targetBox.width / 2,
                        targetBox.y + targetBox.height / 2
                    );
                    await this.page.mouse.up();
                } else {
                    throw new Error('Could not perform drag and drop, element(s) not found.');
                }
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    //Element Actions Ends

    // Get Info Keywords Starts
    async getElementAttribute(selector, attributeName, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Get attribute "${attributeName}" from "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });

                const attrValue = await locator.getAttribute(attributeName);

                if (attrValue === null) {
                    // Attribute does not exist → handle failure
                    throw new Error(`Attribute "${attributeName}" not found on element "${selector}"`);
                }

                // Attribute exists, return value or '' if empty
                return attrValue;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return ''; // safe return for CONTINUE_ON_FAILURE or OPTIONAL
            }
        });
    }

    async getText(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Get text from "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                return await locator.textContent();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return null;
            }
        });
    }

    async getUrl(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Get current page URL`, async () => {
            try {
                return this.page.url();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return ''; // safe fallback
            }
        });
    }

    async getTitle(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Get current page title`, async () => {
            try {
                return await this.page.title();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return ''; // safe fallback
            }
        });
    }

    async getWindowIndex(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Get window index of current page`, async () => {
            try {
                const pages = this.page.context().pages();
                const index = pages.findIndex(p => p === this.page);
                if (index === -1) throw new Error('Current page not found in context');
                return index;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return -1; // safe fallback
            }
        });
    }

    // Get Info Keywords Ends

    //Verification Keywords Starts
    async verifyElementVisible(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Check visibility of "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                return await locator.isVisible();
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyEqual(expected, actual, failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Verify equal: expected="${expected}", actual="${actual}"`, async () => {
            try {
                if (expected !== actual) {
                    throw new Error(`Values not equal. Expected: "${expected}", Actual: "${actual}"`);
                }
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyMatch(expected, actual, failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Verify match: expected="${expected}", actual="${actual}"`, async () => {
            try {
                let isMatch = false;
                if (expected instanceof RegExp) {
                    isMatch = expected.test(actual);
                } else {
                    isMatch = expected === actual;
                }

                if (!isMatch) {
                    throw new Error(`Values do not match. Expected: "${expected}", Actual: "${actual}"`);
                }
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async assertEqual(expected, actual) {
        await test.step(`Assert equal: expected="${expected}", actual="${actual}"`, async () => {
            if (expected !== actual) {
                throw new Error(`Assertion failed: Values not equal. Expected: "${expected}", Actual: "${actual}"`);
            }
        });
    }

    async verifyContains(actual, expected, failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Verify contains: expected "${expected}" in actual "${actual}"`, async () => {
            try {
                expect(actual).toContain(expected);
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyTextInElements(selector, expectedText, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify text "${expectedText}" in elements "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                const elements = await locator.all();

                for (const element of elements) {
                    const text = (await element.textContent())?.trim();
                    if (text?.includes(expectedText)) return true;
                }

                throw new Error(`Text "${expectedText}" not found in elements: ${selector}`);
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyElementPresent(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify element present: "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false; 
            }
        });
    }

    async verifyElementChecked(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify element checked: "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });
                const checked = await locator.isChecked();
                if (!checked) {
                    throw new Error(`Element "${selector}" is not checked`);
                }
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyTextPresent(text, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify text present: "${text}"`, async () => {
            try {
                // Wait for page content to contain the text
                const pageContent = await this.page.textContent('body', { timeout: this.resolveActionTimeout(timeout) });
                if (!pageContent || !pageContent.includes(text)) {
                    throw new Error(`Text "${text}" not found on the page`);
                }
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyElementText(selector, expectedText, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify element text for "${selector}" is "${expectedText}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });

                const actualText = await locator.textContent();
                if (actualText?.trim() !== expectedText) {
                    throw new Error(`Element "${selector}" text mismatch. Expected: "${expectedText}", Actual: "${actualText?.trim()}"`);
                }
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async verifyElementDisabled(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify element disabled: "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });

                const isDisabled = await locator.isDisabled();
                if (!isDisabled) {
                    throw new Error(`Element "${selector}" is not disabled`);
                }

                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false; 
            }
        });
    }

    async verifyElementEnabled(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Verify element enabled: "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({ timeout: this.resolveActionTimeout(timeout) });

                const isEnabled = await locator.isEnabled();
                if (!isEnabled) {
                    throw new Error(`Element "${selector}" is not enabled`);
                }

                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false; 
            }
        });
    }

    //Verification Keywords Ends

    //Wait Actions Starts

    async waitForElementVisible(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Wait for element visible: "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({
                    state: 'visible',
                    timeout: this.resolveActionTimeout(timeout),
                });
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async wait(ms, failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Wait for ${ms} ms`, async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, ms));
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async waitForElementPresent(selector, failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        return await test.step(`Wait for element present: "${selector}"`, async () => {
            try {
                const locator = this.page.locator(selector);
                await locator.waitFor({
                    state: 'attached',
                    timeout: this.resolveActionTimeout(timeout),
                });
                return true;
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return false;
            }
        });
    }

    async waitForPageLoad(failureHandling = FailureHandling.STOP_ON_FAILURE, timeout) {
        await test.step(`Wait for page load`, async () => {
            try {
                await this.page.waitForLoadState('load', {
                    timeout: this.resolveActionTimeout(timeout),
                });
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }
    //Wait Actions Ends
    
    //Alert Actions Starts
    async acceptAlert(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Accept alert`, async () => {
            try {
                this.page.on('dialog', async dialog => await dialog.accept());
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async dismissAlert(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        await test.step(`Dismiss alert`, async () => {
            try {
                this.page.on('dialog', async dialog => await dialog.dismiss());
            } catch (error) {
                await this.handleFailure(error, failureHandling);
            }
        });
    }

    async getAlertText(failureHandling = FailureHandling.STOP_ON_FAILURE) {
        return await test.step(`Get alert text`, async () => {
            try {
                return new Promise(resolve => {
                    this.page.on('dialog', async dialog => {
                        resolve(dialog.message());
                        await dialog.dismiss();
                    });
                });
            } catch (error) {
                await this.handleFailure(error, failureHandling);
                return null;
            }
        });
    }
    //Alert Actions Ends

    //Excel Actions Starts
async readFromExcel(
        path,
        sheetName,
        rowNo,
        colNo,
        failureHandling = FailureHandling.STOP_ON_FAILURE
    ) {
        return await test.step(
            `Read Excel [${path}] Sheet="${sheetName}" Row=${rowNo} Col=${colNo}`,
            async () => {
                try {
                    return ExcelUtil.read(path, sheetName, rowNo, colNo);
                } catch (error) {
                    await this.handleFailure(error, failureHandling);
                    return null;
                }
            }
        );
    }

    async writeToExcel(
        path,
        sheetName,
        rowNo,
        colNo,
        value,
        failureHandling = FailureHandling.STOP_ON_FAILURE
    ) {
        return await test.step(
            `Write Excel [${path}] Sheet="${sheetName}" Row=${rowNo} Col=${colNo}`,
            async () => {
                try {
                    ExcelUtil.write(path, sheetName, rowNo, colNo, value);
                } catch (error) {
                    await this.handleFailure(error, failureHandling);
                }
            }
        );
    }

    //Excel Actions Ends

}

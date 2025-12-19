import { test, expect } from '../Templates/webFixture';
import { FailureHandling } from '../Templates/FailureHandling.js';

test('login to application', async ({ web }) => {
    await web.navigate('https://opensource-demo.orangehrmlive.com/', 30000);
    await web.maximizeWindow();
    await web.setText("//input[@name='username']", 'Admin');
    await web.setText("//input[@name='password']", 'admin123');
    await web.click("//button[@type='submit']");
    await web.verifyElementVisible("//h6[text()='Dashboard']");
    await web.hover("//button[@title='Assign Leave']")
    // await web.wait(10000);

    const index =  await web.getWindowIndex();
    console.log("Current Window Index: " + index);


});
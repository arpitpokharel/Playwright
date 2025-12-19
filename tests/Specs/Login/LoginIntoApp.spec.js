import { test } from '../../../Templates/webFixture.js';
import LoginPage from '../../Pages/Login.js';

test('login with valid credentials', async ({ web }) => {
    const loginPage = new LoginPage(web);
    await loginPage.navigateToLogin(globalVariable.baseUrl);
    await loginPage.login(
        globalVariable.username,
        globalVariable.password
    );
    await loginPage.verifyDashboardVisible();
});

test('login with invalid credentials', async ({ web }) => {
    const loginPage = new LoginPage(web);
    const username = await web.readFromExcel(
    'DataFiles/usercredentials.xlsx',
    'Sheet1',
    2,
    1
    );
    console.log('Username from Excel:', username);

    await loginPage.navigateToLogin(globalVariable.baseUrl);
    await loginPage.login('Admin', 'wrongpassword');
    await loginPage.verifyErrorMessage('Invalid Credentials');
});


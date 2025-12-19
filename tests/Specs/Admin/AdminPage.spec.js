import { test } from '../../../Templates/webFixture.js';
// import AdminPage from '../Pages/Admin.js';
// import LoginPage from '../Pages/Login.js';
import * as pages from '../../Pages/Index.js';

test('Enter Admin Page', async ({ web }) => {

    const loginPage = new pages.LoginPage(web);
    const adminPage = new pages.AdminPage(web);
    
    await loginPage.navigateToLogin(globalVariable.baseUrl);
        await loginPage.login(
        globalVariable.username,
        globalVariable.password
    );
    await loginPage.verifyDashboardVisible();
    await adminPage.enterAdminPage();
    
});

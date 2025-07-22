import { expect, test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

const users = require('../testdata/testUserData.json');


test("Login with an invalid user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  // Extract user1 credentials from the JSON file
  const userLoginInfo = users.user1;
  // await loginPage.quickLogin(process.env.usernameid!,faker.number.float.length.toFixed(6) )
  await loginPage.quickLogin(userLoginInfo.usernameid, userLoginInfo.password )
});

test("Login with a Valid User", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.quickLogin(process.env.usernameid!,process.env.pwd! )
});




import { Page, expect } from "@playwright/test";
import HomePage from "./HomePage";
import logger from "../utils/LoggerUtil";

export default class LoginPage {
  private readonly usernameInputSelector = "#user-name";
  private readonly usernameInputSelectors = ["#username",'input[name="username"]', ".username", "//*[@id='username]"];
  private readonly passwordInputSelector = "#password";
  private readonly loginButtonSelector = "#login-button";
  private readonly expectedErrorMessage = 'Epic sadface: Username and password do not match any user in this service';
  private readonly loginErrorMsgLocator = '[data-test="error"]';
  private readonly lockedoutUserMessage = "Epic sadface: Sorry, this user has been locked out."


  constructor(private page: Page) {}

  async quickLogin(username: string, password: string) {
    await this.navigateToLoginPage();
    await this.fillUsername(username);
    await this.fillPassword(password); 
    await this.clickLoginBtn();
    await this.validateLoginSuccessful(username);
    const homePage = new HomePage(this.page);
    return homePage;
  }

  async navigateToLoginPage() {
    await this.page.goto(process.env.url!);
    logger.info("Navigated to url");
  }

  async fillUsername(username: string) {
    await this.page.locator(this.usernameInputSelector).fill(username);
    logger.info("Filled username");
  }

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInputSelector).fill(password);
    logger.info("Filled pasword");
  }

  async clickLoginBtn() {
    await this.page
      .locator(this.loginButtonSelector)
      .click();
  }

  async validateLoginSuccessful(username){
    const errorMsgText = this.page.locator(this.loginErrorMsgLocator);
    // Check if the error element exists
    const isErrorVisible = await errorMsgText.isVisible();
    var errorText;

    if (isErrorVisible) {
      // If the error element exists, get its text content
      errorText = await errorMsgText.textContent();

    if(username === "locked_out_user"){
      // Assert that the error message is the expected one
      expect(errorText?.trim()).toBe(this.lockedoutUserMessage);
      }       
        // Assert that the error message is the expected one
        logger.warn(`Error message found: ${errorText}`);
    } else {
      // If no error message is visible, check if the URL contains 'inventory'
      const currentUrl = this.page.url();
      expect(currentUrl).toContain("inventory");
      logger.info('Login successful, redirected to inventory page.');
    }
  }

  async clickLoginButton() {
    await this.page
      .locator(this.loginButtonSelector)
      .click()
      .catch((error) => {
        logger.error(`Error clicking login button: ${error}`);
        throw error; // rethrow the error if needed
      })
      .then(() => logger.info("Clicked login button"));

    const homePage = new HomePage(this.page);
    return homePage;
  }
}

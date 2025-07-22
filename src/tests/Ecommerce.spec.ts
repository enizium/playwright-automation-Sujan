import { Page, test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/Checkout";
import OverviewPage from "../pages/Overview";
import FinishPage from "../pages/Finish";

let page: Page;
let homePage: HomePage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let overviewPage: OverviewPage;
let finishPage: FinishPage;


test.describe('E-commerce E2E', () => {

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.quickLogin(process.env.usernameid!, process.env.pwd!);    
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    overviewPage = new OverviewPage(page);
    finishPage = new FinishPage(page);
  });

  test('Filter Products by Name and Price', async () => {
    await homePage.applyFilterByNameDesc();
    await homePage.verifyProductsSortedByNameDesc();
  
    await homePage.applyFilterByPriceLowToHigh();
    await homePage.verifyProductsSortedByPriceLowToHigh();
  });

  test('Add items to the cart and perfom checkout ', async () => {
    await homePage.addItemsToCart();

    await cartPage.verifyItemsInCart();
    await cartPage.clickCheckoutBtn();

    await checkoutPage.YourInformation();
    await checkoutPage.clickContinueBtn();

    await overviewPage.validateOverviewOrderList();
    await overviewPage.validateTotalPrice();
    await overviewPage.clickFinishBtn();
    
    await finishPage.validateOrderCompletionMessage();

  });

  test.afterAll(async () => {
    await page.close();
  });

});

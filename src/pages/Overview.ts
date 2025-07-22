import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";
import CartPage from "./CartPage";

export default class OverviewPage {
  private readonly finishBtn = '//*[@class="btn_action cart_button"]';
  private readonly totalPriceLocator = '//*[@id="checkout_summary_container"]/div/div[2]/div[5]';


  constructor(private page: Page) {}

    async validateOverviewOrderList(){
        const cartPage = new CartPage(this.page);
        cartPage.validateCartItem();
    }

    private async calculateTotalPrice(storedCartItems: { name: string; price: string }[]): Promise<number> {
    return storedCartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/^\$/, '').replace(/,/g, '')); // Remove $ and commas
        return total + price;
    }, 0);
    }

    async validateTotalPrice() {
    // Retrieve stored cart items from local storage
    const storedCartItems = await this.page.evaluate(() => {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
    });

    // Calculate total price of stored items
    const totalPrice = await this.calculateTotalPrice(storedCartItems);

    // Retrieve the total price from the checkout summary page
    const totalPriceText = await this.page.locator(this.totalPriceLocator).textContent();
    const totalPriceFromPage = parseFloat(totalPriceText?.replace(/Item total: \$/, '').replace(/,/g, '') || '0'); // Remove prefix and commas

    // Assert that the total price matches the value on the page
    expect(totalPrice).toBe(totalPriceFromPage);
    logger.info('Total price validation passed. Calculated total price matches the value on the checkout summary page.');
    }

    async clickFinishBtn() {
        await this.page.locator(this.finishBtn).click();
        logger.info('Finish button clicked');
      }
}





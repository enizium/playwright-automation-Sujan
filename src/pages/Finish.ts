import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";
import { faker } from "@faker-js/faker";

export default class FinishPage {
  private readonly orderCompleteMsg = 'THANK YOU FOR YOUR ORDER'; 
  private readonly orderCompleteMsgPath='//*[@class="complete-header"]'

  constructor(private page: Page) {}

  async validateOrderCompletionMessage() {
    const orderCompleteLocator = this.page.locator(this.orderCompleteMsgPath);
    const actualMessage = await orderCompleteLocator.textContent();
    
    // Assert that the text content matches the expected message
    expect(actualMessage?.trim()).toBe(this.orderCompleteMsg);
    // Log the result
    logger.info(`Order completion message verified: '${actualMessage?.trim()}'`);
  }

}